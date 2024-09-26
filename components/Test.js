import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScoreCard from './ScoreCard';
import ClientSideMotionButton from './ClientSideMotionButton';
import useClientSideRender from '../hooks/useClientSideRender';
import { motion } from 'framer-motion';

function Test({ questions, testName, questionClassName, optionClassName, onTestComplete, timeLimit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSolutions, setShowSolutions] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [attemptsLeft, setAttemptsLeft] = useState(40);
  const router = useRouter();
  const [showScoreCard, setShowScoreCard] = useState(false);
  const isClient = useClientSideRender();

  useEffect(() => {
    if (!isClient) return;

    try {
      const storedAttempts = localStorage.getItem(`${testName}_attempts`);
      if (storedAttempts) {
        setAttemptsLeft(parseInt(storedAttempts));
      }

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error('Error in Test component useEffect:', error);
    }
  }, [testName, isClient]);

  const handleAnswer = (answer) => {
    if (!attemptedQuestions[currentQuestion]) {
      setAnswers({ ...answers, [currentQuestion]: answer });
      setAttemptedQuestions({ ...attemptedQuestions, [currentQuestion]: true });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    const newScore = questions.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0);
    }, 0);
    setScore(newScore);
    setShowSolutions(true);

    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);
    localStorage.setItem(`${testName}_attempts`, newAttemptsLeft.toString());

    try {
      await fetch('/api/submit_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID when authentication is implemented
          test_type: testName,
          answers: answers,
          score: newScore,
        }),
      });
      if (onTestComplete) {
        onTestComplete(newScore, questions.length);
      }
    } catch (error) {
      console.error('Error submitting test results:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="text-center text-2xl font-bold text-red-500">No questions available.</div>;
  }

  if (showScoreCard) {
    return (
      <ScoreCard
        score={score}
        totalQuestions={questions.length}
        testName={testName}
        learningPath={generateLearningPath(score, questions.length)}
      />
    );
  }

  if (attemptsLeft <= 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">No attempts left</h2>
        <p className="text-xl mb-6 text-gray-600">You have used all your attempts for this test.</p>
      </div>
    );
  }

  if (showSolutions) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Test Results</h2>
        <p className="text-xl mb-6 text-center text-gray-600">Your score: {score} / {questions.length}</p>
        {questions.map((question, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8 p-6 bg-white rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{question.question}</h3>
            <p className="mb-2 text-gray-600">Your answer: {answers[index] || 'Not answered'}</p>
            <p className="mb-2 text-green-600">Correct answer: {question.correctAnswer}</p>
            {answers[index] !== question.correctAnswer && (
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800 font-semibold">Explanation:</p>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}
          </motion.div>
        ))}
        <ClientSideMotionButton
          onClick={() => setShowScoreCard(true)}
          className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors duration-300"
        >
          View Score Card
        </ClientSideMotionButton>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="text-xl font-semibold text-gray-600">Time left: {formatTime(timeLeft)}</p>
        </div>
        <p className="text-lg mb-4 text-gray-600">Attempts left: {attemptsLeft}</p>
        <p className={questionClassName}>{questions[currentQuestion].question}</p>
        <div className="space-y-4 mt-6">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left ${optionClassName} ${answers[currentQuestion] === option ? 'bg-blue-200' : ''} ${attemptedQuestions[currentQuestion] ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => handleAnswer(option)}
              disabled={attemptedQuestions[currentQuestion]}
            >
              {option}
            </motion.button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <ClientSideMotionButton
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </ClientSideMotionButton>
          <ClientSideMotionButton
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Submit
          </ClientSideMotionButton>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-600">
          Questions answered: {Object.keys(answers).length} / {questions.length}
        </div>
      </div>
    </div>
  );
}

function generateLearningPath(score, totalQuestions) {
  const percentage = (score / totalQuestions) * 100;
  if (percentage < 40) {
    return {
      message: "Your score indicates that you may benefit from foundational learning in this area. Consider starting with basic concepts and gradually building up your knowledge.",
      link: `/learning-paths/beginner`
    };
  } else if (percentage < 70) {
    return {
      message: "You've shown a good understanding of the basics. Focus on strengthening your weak areas and diving deeper into more complex topics.",
      link: `/learning-paths/intermediate`
    };
  } else {
    return {
      message: "Great job! You've demonstrated strong knowledge in this area. Consider exploring advanced topics and real-world applications to further enhance your skills.",
      link: `/learning-paths/advanced`
    };
  }
}

export default Test;