import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (router.query.score) {
      const score = parseInt(router.query.score);
      const testType = router.query.test;
      
      // Fetch detailed results from the backend
      fetch(`/api/test_results?test=${testType}&score=${score}`)
        .then(response => response.json())
        .then(data => {
          setResults(data);
          return fetch(`/api/resources?test=${testType}&score=${score}&details=${JSON.stringify(data.details)}`);
        })
        .then(response => response.json())
        .then(data => setResources(data))
        .catch(error => console.error('Error fetching results or resources:', error));
    }
  }, [router.query]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg">
          <p className="text-2xl font-semibold text-white">Loading results...</p>
        </div>
      </div>
    );
  }

  const weakAreas = Object.entries(results.details)
    .filter(([_, score]) => score.correct / score.total < 0.6)
    .map(([area, _]) => area);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-12 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center animate-pulse">Your Test Results</h1>
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg mb-8 transform hover:scale-105 transition-all duration-300 ease-in-out animate-fadeIn">
          <h2 className="text-3xl font-semibold mb-4">Overall Score: {results.score} / {results.total}</h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Breakdown:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(results.details).map(([area, score]) => (
                <li key={area} className="text-lg">
                  {area.replace('-', ' ')}: {score.correct} / {score.total}
                  {score.correct / score.total < 0.6 && 
                    <span className="text-red-300 ml-2">(Needs improvement)</span>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
        {weakAreas.length > 0 && (
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-center">Recommended Resources:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.filter(resource => weakAreas.includes(resource.area)).map((resource) => (
                <a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                >
                  <h4 className="text-xl font-semibold mb-2">{resource.title}</h4>
                  <p className="text-blue-200 mb-2">{resource.description}</p>
                  <p className="text-yellow-200">Focus area: {resource.area.replace('-', ' ')}</p>
                  <p className="text-blue-200 mt-4">Access resource &rarr;</p>
                </a>
              ))}
            </div>
          </div>
        )}
        {weakAreas.length === 0 && (
          <div className="text-center">
            <h3 className="text-3xl font-semibold mb-4">Great job!</h3>
            <p className="text-xl">You've performed well in all areas. Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
}