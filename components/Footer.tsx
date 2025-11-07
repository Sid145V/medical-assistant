
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AI Medical Assistant. All rights reserved.
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Disclaimer: This service provides AI-powered guidance and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
