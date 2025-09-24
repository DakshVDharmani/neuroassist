import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = ({ message = "The page you're looking for doesn't exist." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default ErrorPage;
