import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaTrophy } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ScoreCard({ score, totalQuestions, testName, learningPath }) {
  const certificateRef = useRef(null);
  const percentage = (score / totalQuestions) * 100;
  const starColor = percentage >= 80 ? 'text-yellow-400' : percentage >= 60 ? 'text-gray-400' : 'text-yellow-700';
  const starType = percentage >= 80 ? 'Gold' : percentage >= 60 ? 'Silver' : 'Bronze';
  const starCount = percentage >= 80 ? 3 : percentage >= 60 ? 2 : 1;

  const generateCertificate = async () => {
    const certificate = certificateRef.current;
    const canvas = await html2canvas(certificate, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${testName.replace(' ', '_')}_Certificate.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Your Score</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl font-bold text-center text-purple-600 mb-6"
        >
          {score} / {totalQuestions}
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full mb-6"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center mb-6"
        >
          {[...Array(starCount)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
            >
              <FaStar className={`text-6xl ${starColor} mx-2`} />
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-3xl font-semibold text-center mb-4 text-gray-700"
        >
          {starType} Star Achievement!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="bg-gray-100 rounded-lg p-6 mb-8"
        >
          <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700 text-center">
            {learningPath.message}
          </p>
        </motion.div>
        <div className="flex justify-center space-x-4">
          <Link href={learningPath.link} passHref>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Start Learning Path
            </motion.a>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateCertificate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-300"
          >
            Get Certificate
          </motion.button>
        </div>
      </div>
      
      {/* Hidden certificate template */}
      <div className="hidden">
        <div ref={certificateRef} className="w-[297mm] h-[210mm] bg-gradient-to-br from-purple-100 to-indigo-100 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Certificate of Achievement</h1>
            <p className="text-xl mb-8 text-gray-600">This certifies that</p>
            <p className="text-3xl font-bold mb-8 text-gray-800">[Your Name]</p>
            <p className="text-xl mb-4 text-gray-600">has successfully completed the</p>
            <p className="text-3xl font-bold mb-8 text-purple-600">{testName}</p>
            <p className="text-xl mb-4 text-gray-600">with a score of</p>
            <p className="text-3xl font-bold mb-8 text-indigo-600">{score} out of {totalQuestions}</p>
            <div className="flex mb-8">
              {[...Array(starCount)].map((_, index) => (
                <FaStar key={index} className={`text-5xl ${starColor} mx-2`} />
              ))}
            </div>
            <p className="text-xl text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}