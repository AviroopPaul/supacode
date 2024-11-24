import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className=" mx-4 flex justify-between items-center">
        <div className="text-sm">
          © {new Date().getFullYear()} Aviroop. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="https://github.com/avirooppaul" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com/in/avirooppaul" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaLinkedin size={20} />
          </a>  
        </div>
      </div>
    </footer>
  );
}

export default Footer; 