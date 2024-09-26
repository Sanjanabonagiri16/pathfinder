import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion(Link);

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-center items-center"
    >
      <motion.h1 
        className="text-6xl font-bold text-white mb-8 text-center"
        variants={fadeInUp}
      >
        Welcome to PathFinder IQ
      </motion.h1>
      
      <motion.p 
        className="text-xl text-white mb-12 text-center max-w-2xl"
        variants={fadeInUp}
      >
        Discover your potential with our advanced aptitude tests and personalized learning paths.
      </motion.p>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {['Emotional Intelligence', 'Aptitude', 'Verbal Ability', 'Mock Interviews', 'Game Aptitude'].map((test, index) => (
          <MotionLink 
            href={`/tests/${test.toLowerCase().replace(' ', '-')}`} 
            key={test}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.h2 
              className="text-2xl font-semibold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {test}
            </motion.h2>
            <motion.p 
              className="text-white opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              Test your {test.toLowerCase()} skills
            </motion.p>
          </MotionLink>
        ))}
      </motion.div>

      <motion.div 
        className="mt-12"
        variants={fadeInUp}
      >
        <Link href="/register">
          <motion.a 
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-purple-100 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </Link>
      </motion.div>
    </motion.div>
  );
}
