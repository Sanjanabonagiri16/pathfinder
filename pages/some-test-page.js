import dynamic from 'next/dynamic';
import ErrorBoundary from '../components/ErrorBoundary';

const DynamicTest = dynamic(() => import('../components/DynamicTest'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ),
});

export default function TestPage() {
  const questions = [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      explanation: "2 + 2 equals 4 in basic arithmetic."
    },
    // Add more questions as needed
  ];

  return (
    <ErrorBoundary>
      <DynamicTest
        questions={questions}
        testName="Sample Test"
        questionClassName="text-lg font-semibold"
        optionClassName="p-2 border rounded hover:bg-gray-100"
        onTestComplete={(score, total) => console.log(`Score: ${score}/${total}`)}
        timeLimit={300}
      />
    </ErrorBoundary>
  );
}