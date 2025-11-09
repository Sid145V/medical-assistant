import React from 'react';
import { motion } from 'framer-motion';

const Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14a3.5 3.5 0 00-3.5 3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10a3.5 3.5 0 013.5 3.5" />
    </svg>
);


const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center text-gray-500 py-10 px-4"
    >
      <Icon />
      <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mt-4">{title}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
