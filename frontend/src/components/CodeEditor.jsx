import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { Resizable } from 're-resizable';
import DSAProblemPanel from './DSAProblemPanel';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [width, setWidth] = useState('50%');

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'go', name: 'Go' },
  ];

  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
    { id: 'hc-black', name: 'High Contrast' },
  ];

  const runCode = async () => {
    try {
      setIsLoading(true);
      setIsOutputVisible(true);
      
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          language
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output || 'Code executed successfully');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <DSAProblemPanel />
      
      <Resizable
        size={{ width, height: '100%' }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(ref.style.width);
        }}
        enable={{ left: true }}
        minWidth="30%"
        maxWidth="70%"
        className="relative"
      >
        <div className="h-screen flex flex-col bg-[#1e1e1e]">
          {/* Enhanced Toolbar */}
          <div className="h-12 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Language:</span>
                <select 
                  className="bg-[#3d3d3d] text-gray-300 px-2 py-1 rounded border border-gray-600"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Theme:</span>
                <select 
                  className="bg-[#3d3d3d] text-gray-300 px-2 py-1 rounded border border-gray-600"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  {themes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Font Size:</span>
                <input 
                  type="number" 
                  min="12" 
                  max="24" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="bg-[#3d3d3d] text-gray-300 px-2 py-1 rounded border border-gray-600 w-16"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCode('')}
                className="text-gray-300 hover:text-white px-2 py-1"
                title="Reset Code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  runCode();
                }}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Running...' : 'Run'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Updated Editor */}
          <div className="flex-grow relative">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                automaticLayout: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                bracketPairColorization: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>

          {/* Output Console */}
          {isOutputVisible && (
            <div className="h-32 bg-[#1e1e1e] border-t border-gray-700 p-4 transform transition-transform duration-300 ease-in-out translate-y-0"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                transform: isOutputVisible ? 'translateY(0)' : 'translateY(100%)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Output:</span>
                <button 
                  onClick={() => setIsOutputVisible(false)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <pre className="text-gray-300 font-mono text-sm overflow-auto max-h-[80px]">{output}</pre>
            </div>
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default CodeEditor;