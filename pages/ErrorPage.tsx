import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC<{ code?: number }> = ({ code = 404 }) => {
  const navigate = useNavigate();
  const messages: { [key: number]: string } = {
    404: "Oops! Page Not Found.",
    500: "Something went wrong on our server.",
  };
  const message = messages[code] || "An unexpected error occurred.";

  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-8xl font-extrabold font-display text-primary">{code}</h1>
      <p className="mt-4 text-2xl font-semibold text-text-light dark:text-text-dark">{message}</p>
      <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
        {code === 404 ? "The page you are looking for does not exist." : "We are working to fix the problem. Please try again later."}
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 btn-primary"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;
