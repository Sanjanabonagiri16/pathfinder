import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [testScores, setTestScores] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUser({ name: 'John Doe' });
      setTestScores({
        'emotional-intelligence': 75,
        'aptitude': 80,
        'verbal-ability': 90,
        'mock-interviews': 85,
        'game-aptitude': 70,
      });
    }
  }, []);

  const tests = [
    { id: 'emotional-intelligence', name: 'Emotional Intelligence', color: 'from-pink-500 to-purple-600', icon: '🧠' },
    { id: 'aptitude', name: 'Aptitude Test', color: 'from-green-500 to-blue-600', icon: '🧮' },
    { id: 'verbal-ability', name: 'Verbal Ability', color: 'from-yellow-500 to-red-600', icon: '📚' },
    { id: 'game-aptitude', name: 'Game Aptitude', color: 'from-indigo-500 to-pink-600', icon: '🎮' },
    { id: 'mock-interviews', name: 'Mock Interviews', color: 'from-blue-500 to-green-600', icon: '🗣️' },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-extrabold mb-12 text-center text-white shadow-text"
        >
          Welcome, {user.name}!
        </motion.h1>
        
        <motion.h2 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl font-bold mb-12 text-center text-white shadow-text"
        >
          Available Tests
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/tests/${test.id}`}>
                <motion.a 
                  className={`block bg-gradient-to-r ${test.color} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{test.icon}</span>
                    <h2 className="text-3xl font-bold text-white shadow-text">{test.name}</h2>
                  </div>
                  <p className="text-white text-xl opacity-90 mb-6">Test your skills now!</p>
                  <motion.div
                    className="bg-white bg-opacity-30 text-white font-semibold py-3 px-6 rounded-full inline-block"
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Start Test
                  </motion.div>
                </motion.a>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.h2 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-bold mb-12 text-center text-white shadow-text"
        >
          Your Test Scores
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              className={`bg-gradient-to-r ${test.color} p-8 rounded-2xl shadow-lg`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 shadow-text">{test.name}</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-white bg-opacity-20">
                      Score
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold inline-block text-white">
                      {testScores[test.id] || 0}%
                    </span>
                  </div>
                </div>
                <motion.div 
                  className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-white bg-opacity-20"
                  initial={{ width: 0 }}
                  animate={{ width: `${testScores[test.id] || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 1 + index * 0.1 }}
                >
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white bg-opacity-50"></div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}