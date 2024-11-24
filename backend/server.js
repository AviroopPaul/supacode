const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MONGODB_URI, JWT_SECRET } = require('./config/config');
const User = require('./models/User');
const Question = require('./models/Question');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Sign up endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload questions to DB
app.post('/api/upload-questions', auth, async (req, res) => {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    
    // Convert questions.json format to DB format
    const questionsArray = Object.entries(problems).map(([topic, problems]) => ({
      topic,
      problems
    }));
    
    await Question.insertMany(questionsArray);
    res.json({ message: 'Questions uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch questions from DB (replaces the existing problems loading)
app.get('/api/problems/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const question = await Question.findOne({ topic });
    res.json(question ? question.problems : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/execute', async (req, res) => {
  const { code, language } = req.body;
  
  try {
    const filename = path.join(__dirname, `temp_${Date.now()}`);
    let command;

    // Define execution commands for different languages
    switch (language) {
      case 'python':
        await fs.writeFile(`${filename}.py`, code);
        command = `python3 ${filename}.py`;
        break;
      case 'javascript':
        await fs.writeFile(`${filename}.js`, code);
        command = `node ${filename}.js`;
        break;
      case 'java':
        // Extract class name from Java code
        const className = extractJavaClassName(code);
        const javaFilename = `${filename}_${className}`;
        await fs.writeFile(`${javaFilename}.java`, code);
        // Use full path to javac and java (modify these paths according to your system)
        command = `/usr/lib/jvm/java-11-openjdk/bin/javac ${javaFilename}.java && /usr/lib/jvm/java-11-openjdk/bin/java -cp ${path.dirname(javaFilename)} ${className}`;
        break;
      case 'cpp':
        await fs.writeFile(`${filename}.cpp`, code);
        command = `g++ ${filename}.cpp -o ${filename} && ${filename}`;
        break;
      default:
        throw new Error('Unsupported language');
    }

    exec(command, { timeout: 5000 }, async (error, stdout, stderr) => {
      // Cleanup temp files
      try {
        const fileToDelete = `${filename}${getFileExtension(language)}`;
        await fs.unlink(fileToDelete);
        // Additional cleanup for compiled files
        if (language === 'cpp') {
          await fs.unlink(filename);
        }
        if (language === 'java') {
          const className = extractJavaClassName(code);
          await fs.unlink(`${filename}_${className}.class`);
          await fs.unlink(`${filename}_${className}.java`);
        }
      } catch (e) {
        console.error('Cleanup error:', e);
      }

      if (error) {
        res.json({ error: stderr || error.message });
        return;
      }
      res.json({ output: stdout });
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Add this helper function for Java class name extraction
function extractJavaClassName(code) {
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  return classMatch ? classMatch[1] : 'Main';
}

function getFileExtension(language) {
  const extensions = {
    python: '.py',
    javascript: '.js',
    java: '.java',
    cpp: '.cpp'
  };
  return extensions[language] || '';
}

app.get('/api/topics', (req, res) => {
  const topics = [
    { id: 'arrays', name: 'Arrays' },
    { id: 'strings', name: 'Strings' },
    { id: 'linked-lists', name: 'Linked Lists' },
    { id: 'trees', name: 'Trees' },
    { id: 'graphs', name: 'Graphs' },
    { id: 'dynamic-programming', name: 'Dynamic Programming' },
  ];
  res.json(topics);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back the React app.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(3001, () => {
  console.log('Code execution server running on port 3001');
}); 