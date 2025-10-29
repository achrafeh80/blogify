import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/BlogContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PostDetail from './pages/PostDetail';
import PublicPosts from './pages/PublicPosts';

function App() {
  const { currentUser } = useAppContext();
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />} 
          />
          <Route path="/posts" element={<PublicPosts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
