import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const learningResources = {
  'emotional-intelligence': {
    beginner: [
      { title: "Introduction to Emotional Intelligence", url: "https://www.verywellmind.com/what-is-emotional-intelligence-2795423" },
      { title: "Developing Self-Awareness", url: "https://www.mindtools.com/pages/article/developing-self-awareness.htm" },
      { title: "Understanding Emotions", url: "https://www.psychologytoday.com/us/basics/emotion-regulation" },
    ],
    intermediate: [
      { title: "Improving Empathy Skills", url: "https://www.helpguide.org/articles/relationships-communication/empathy.htm" },
      { title: "Emotional Intelligence in the Workplace", url: "https://hbr.org/2017/02/emotional-intelligence-has-12-elements-which-do-you-need-to-work-on" },
      { title: "Managing Emotions Under Pressure", url: "https://www.mindtools.com/pages/article/managing-emotions-under-pressure.htm" },
    ],
    advanced: [
      { title: "Advanced Emotional Intelligence Techniques", url: "https://positivepsychology.com/emotional-intelligence-exercises/" },
      { title: "Applying EI in Leadership", url: "https://www.ccl.org/articles/leading-effectively-articles/emotional-intelligence-leadership/" },
      { title: "EI and Conflict Resolution", url: "https://www.pon.harvard.edu/daily/conflict-resolution/emotional-intelligence-as-a-tool-for-conflict-resolution/" },
    ],
  },
  'aptitude': {
    beginner: [
      { title: "Introduction to Mathematical Aptitude", url: "https://www.mathsisfun.com/" },
      { title: "Basic Algebra Concepts", url: "https://www.khanacademy.org/math/algebra-basics" },
      { title: "Fundamental Geometry", url: "https://www.mathplanet.com/education/geometry" },
    ],
    intermediate: [
      { title: "Advanced Algebra", url: "https://www.khanacademy.org/math/algebra" },
      { title: "Trigonometry Basics", url: "https://www.mathsisfun.com/trigonometry.html" },
      { title: "Introduction to Statistics", url: "https://www.statisticshowto.com/probability-and-statistics/" },
    ],
    advanced: [
      { title: "Calculus Fundamentals", url: "https://www.khanacademy.org/math/calculus-1" },
      { title: "Advanced Problem Solving Techniques", url: "https://artofproblemsolving.com/" },
      { title: "Mathematical Reasoning and Logic", url: "https://plato.stanford.edu/entries/mathematical-reasoning/" },
    ],
  },
  'verbal-ability': {
    beginner: [
      { title: "Basic English Grammar", url: "https://www.englishgrammar.org/" },
      { title: "Vocabulary Building Techniques", url: "https://www.vocabulary.com/" },
      { title: "Introduction to Reading Comprehension", url: "https://www.readtheory.org/" },
    ],
    intermediate: [
      { title: "Advanced Grammar Concepts", url: "https://www.grammarly.com/blog/category/handbook/" },
      { title: "Improving Verbal Reasoning Skills", url: "https://www.mindtools.com/pages/article/newTMC_91.htm" },
      { title: "Effective Communication Strategies", url: "https://www.skillsyouneed.com/ips/communication-skills.html" },
    ],
    advanced: [
      { title: "Mastering Analogies and Idioms", url: "https://www.vocabulary.com/lists/52473" },
      { title: "Advanced Reading Comprehension Techniques", url: "https://www.criticalreading.com/" },
      { title: "Rhetoric and Persuasive Writing", url: "https://owl.purdue.edu/owl/general_writing/academic_writing/establishing_arguments/rhetorical_strategies.html" },
    ],
  },
  'mock-interviews': {
    beginner: [
      { title: "Introduction to Interview Skills", url: "https://www.themuse.com/advice/interview-preparation-tips" },
      { title: "Common Interview Questions and Answers", url: "https://www.indeed.com/career-advice/interviewing/top-interview-questions-and-answers" },
      { title: "Body Language in Interviews", url: "https://www.monster.com/career-advice/article/body-language-interview" },
    ],
    intermediate: [
      { title: "Behavioral Interview Techniques", url: "https://www.thebalancecareers.com/behavioral-job-interviews-2058575" },
      { title: "Answering Difficult Interview Questions", url: "https://www.glassdoor.com/blog/common-interview-questions/" },
      { title: "Developing Your Personal Brand", url: "https://www.themuse.com/advice/the-ultimate-guide-to-building-your-personal-brand" },
    ],
    advanced: [
      { title: "Advanced Interview Strategies", url: "https://www.forbes.com/sites/ashiraprossack1/2019/03/27/5-advanced-interview-techniques-to-master/" },
      { title: "Negotiation Skills for Job Offers", url: "https://www.salary.com/articles/salary-negotiation-tips/" },
      { title: "Leadership and Executive Interview Preparation", url: "https://hbr.org/2015/01/how-to-ace-an-executive-level-job-interview" },
    ],
  },
  'game-aptitude': {
    beginner: [
      { title: "Introduction to Game Design", url: "https://www.coursera.org/learn/game-design" },
      { title: "Basic Game Development Concepts", url: "https://www.edx.org/course/cs50s-introduction-to-game-development" },
      { title: "Understanding Game Mechanics", url: "https://www.gamasutra.com/view/feature/167214/game_mechanics_advanced_game_.php" },
    ],
    intermediate: [
      { title: "Game Programming Fundamentals", url: "https://www.udacity.com/course/2d-game-development-with-libgdx--ud405" },
      { title: "3D Modeling for Games", url: "https://www.pluralsight.com/courses/beginners-guide-3d-modeling-games-blender" },
      { title: "Game AI Basics", url: "https://www.raywenderlich.com/2808-introduction-to-ai-programming-for-games" },
    ],
    advanced: [
      { title: "Advanced Game Design Patterns", url: "https://gameprogrammingpatterns.com/" },
      { title: "Game Engine Architecture", url: "https://www.gameenginebook.com/" },
      { title: "Multiplayer Game Development", url: "https://www.udemy.com/course/unrealmultiplayer/" },
    ],
  },
};

export default function LearningPath() {
  const router = useRouter();
  const { testId, level } = router.query;
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (testId && level && learningResources[testId]) {
      setResources(learningResources[testId][level] || []);
    }
  }, [testId, level]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            {testId && testId.replace('-', ' ')} - {level && level.charAt(0).toUpperCase() + level.slice(1)} Learning Path
          </h1>
          {resources.length > 0 ? (
            <ul className="space-y-4">
              {resources.map((resource, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No resources available for this learning path.</p>
          )}
        </div>
      </div>
    </div>
  );
}