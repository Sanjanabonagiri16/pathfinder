import dynamic from 'next/dynamic';

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
    // Your questions array here
  ];

  return (
    <DynamicTest
      questions={questions}
      testName="Your Test Name"
      questionClassName="your-question-class"
      optionClassName="your-option-class"
      onTestComplete={(score, total) => {/* your completion handler */}}
      timeLimit={3600} // or whatever your time limit is
    />
  );
}