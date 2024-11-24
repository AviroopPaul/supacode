import React, { useState, useEffect } from "react";
import {
  FaListUl,
  FaCode,
  FaTree,
  FaChartLine,
  FaRegLightbulb,
  FaClipboardList,
} from "react-icons/fa";

const DSAProblemPanel = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchProblems();
      setSelectedProblem(null);
    }
  }, [selectedTopic]);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  console.log(baseUrl);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/topics`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/problems/${selectedTopic}`);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return darkMode ? "bg-green-700" : "bg-green-600";
      case "Medium":
        return darkMode ? "bg-yellow-700" : "bg-yellow-600";
      case "Hard":
        return darkMode ? "bg-red-700" : "bg-red-600";
      default:
        return "";
    }
  };

  const getTopicIcon = (topicId) => {
    const iconColor = darkMode ? "text-orange-400" : "text-orange-500";
    const icons = {
      arrays: <FaListUl className={iconColor} />,
      strings: <FaClipboardList className={iconColor} />,
      "linked-lists": <FaRegLightbulb className={iconColor} />,
      trees: <FaTree className={iconColor} />,
      graphs: <FaChartLine className={iconColor} />,
      "dynamic-programming": <FaCode className={iconColor} />,
    };
    return icons[topicId] || null;
  };

  return (
    <div className="w-1/2 h-screen overflow-y-auto bg-white dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="flex flex-col items-center">
        {!selectedTopic && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Topics:</h2>
            <div className="grid grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  {getTopicIcon(topic.id)}
                  <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold ml-2">
                    {topic.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTopic && !selectedProblem && (
          <div className="w-full">
            <div className="flex flex-col items-start mb-4">
              <button
                className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 mr-4"
                onClick={() => setSelectedTopic("")}
              >
                ← Back to topics
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {topics.find((t) => t.id === selectedTopic)?.name}
              </h2>
            </div>
            <div className="space-y-2">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setSelectedProblem(problem)}
                >
                  <h3 className="text-gray-900 dark:text-gray-100">{problem.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm text-white ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProblem && (
          <div className="text-gray-900 dark:text-gray-100 w-full">
            <button
              className="mb-4 text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
              onClick={() => setSelectedProblem(null)}
            >
              ← Back to problems
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedProblem.title}</h2>
            <div className="mb-4">
              <span
                className={`px-2 py-1 rounded text-sm text-white mr-2 ${getDifficultyColor(
                  selectedProblem.difficulty
                )}`}
              >
                {selectedProblem.difficulty}
              </span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">{selectedProblem.description}</p>
              {selectedProblem.examples && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Examples:</h3>
                  {selectedProblem.examples.map((example, index) => (
                    <div key={index} className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
                      <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                        {example}
                      </pre>
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
