import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CodeEditor from './components/CodeEditor';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App font-poppins min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={<><Login /><Footer /></>} />
          <Route path="/signup" element={<><Signup /><Footer /></>} />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <CodeEditor />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
