import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/BlogContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PostDetail from './pages/PostDetail';
import PublicPosts from './pages/PublicPost';
import Profile from './pages/Profile';
import Users from './pages/Users';

function App() {
  const { currentUser } = useAppContext();
  return (
    <div className={currentUser ? '' : 'bg-gray-100 dark:bg-gray-900 min-h-screen'}>
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
          <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/users" element={currentUser && currentUser.role === 'Admin' ? <Users /> : <Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
