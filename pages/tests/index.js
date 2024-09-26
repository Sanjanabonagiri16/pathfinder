import Link from 'next/link';

const tests = [
  { id: 'emotional-intelligence', name: 'Emotional Intelligence' },
  { id: 'aptitude', name: 'Aptitude Test' },
  { id: 'verbal-ability', name: 'Verbal Ability' },
  { id: 'game-aptitude', name: 'Game Aptitude' },
  { id: 'mock-interviews', name: 'Mock Interviews' },
];

export default function Tests() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <Link key={test.id} href={`/tests/${test.id}`}>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold mb-2">{test.name}</h2>
              <p className="text-gray-600">Click to start the test</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}