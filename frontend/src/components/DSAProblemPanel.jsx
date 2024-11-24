import React, { useState, useEffect } from 'react';
import { FaListUl, FaCode, FaTree, FaChartLine, FaRegLightbulb, FaClipboardList } from 'react-icons/fa';

const DSAProblemPanel = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchProblems();
      setSelectedProblem(null);
    }
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/topics');
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/problems/${selectedTopic}`);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600';
      case 'Medium':
        return 'bg-yellow-600';
      case 'Hard':
        return 'bg-red-600';
      default:
        return '';
    }
  };

  const getTopicIcon = (topicId) => {
    const icons = {
      arrays: <FaListUl className="text-orange-500"/>,
      strings: <FaClipboardList className="text-orange-500" />,
      'linked-lists': <FaRegLightbulb className="text-orange-500" />,
      trees: <FaTree className="text-orange-500" />,
      graphs: <FaChartLine className="text-orange-500" />,
      'dynamic-programming': <FaCode className="text-orange-500" />,
    };
    return icons[topicId] || null;
  };

  return (
    <div className="w-1/2 h-screen overflow-y-auto bg-[#444141] p-4">
      <div className="flex flex-col items-center">
        {!selectedTopic && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Topics:</h2>
            <div className="grid grid-cols-2 gap-4">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  className="bg-[#3d3d3d] p-4 rounded cursor-pointer hover:bg-[#4a4a4a] transition-colors flex items-center"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  {getTopicIcon(topic.id)}
                  <h3 className="text-gray-300 text-lg font-semibold ml-2">{topic.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTopic && !selectedProblem && (
          <div className="w-full">
            <div className="flex flex-col items-start mb-4">
              <button
                className="text-orange-500 hover:text-orange-400 mr-4"
                onClick={() => setSelectedTopic('')}
              >
                ← Back to topics
              </button>
              <h2 className="text-xl font-bold text-gray-300">
                {topics.find(t => t.id === selectedTopic)?.name}
              </h2>
            </div>
            <div className="space-y-2">
              {problems.map(problem => (
                <div
                  key={problem.id}
                  className="bg-[#3d3d3d] p-4 rounded cursor-pointer hover:bg-[#4a4a4a] transition-colors"
                  onClick={() => setSelectedProblem(problem)}
                >
                  <h3 className="text-gray-300">{problem.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm text-gray-300 ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProblem && (
          <div className="text-gray-300 w-full">
            <button
              className="mb-4 text-orange-500 hover:text-orange-400"
              onClick={() => setSelectedProblem(null)}
            >
              ← Back to problems
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedProblem.title}</h2>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded text-sm mr-2 ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <div className="prose prose-invert">
              <p>{selectedProblem.description}</p>
              {selectedProblem.examples && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Examples:</h3>
                  {selectedProblem.examples.map((example, index) => (
                    <div key={index} className="mb-4 bg-[#2d2d2d] p-4 rounded">
                      <pre className="text-sm whitespace-pre-wrap">{example}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSAProblemPanel; 