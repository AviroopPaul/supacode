import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CodeBracketIcon, CommandLineIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import config from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const baseUrl = process.env.REACT_APP_BASE_URL;
    console.log(baseUrl);

    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/editor');
    } catch (err) {
      setError(err.message);
    }
  };

  const features = [
    {
      icon: <CodeBracketIcon className="h-6 w-6" />,
      title: "Multiple Languages",
      description: "Practice in Python, Java, JavaScript, C++, Go, and Ruby"
    },
    {
      icon: <CommandLineIcon className="h-6 w-6" />,
      title: "Built-in Code Editor",
      description: "Powerful editor with syntax highlighting and auto-completion"
    },
    {
      icon: <CpuChipIcon className="h-6 w-6" />,
      title: "DSA Focus",
      description: "Curated collection of DSA problems with detailed solutions"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Landing content */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="flex items-center mb-8">
          <CodeBracketIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="ml-2 text-4xl font-bold text-gray-900">Supacode</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Master Data Structures & Algorithms<br />
          <span className="text-indigo-600">One Problem at a Time</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-indigo-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="hidden lg:flex lg:w-1/3 items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 px-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to continue your practice
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 