import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/BlogContext';

const Navbar = () => {
  const { currentUser, logout, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/posts" className="text-xl font-bold">Blogify</Link>
        <div>
          <Link to="/posts" className="mr-4 hover:underline">Articles</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
              <button onClick={handleLogout} className="mr-4 hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">Connexion</Link>
              <Link to="/signup" className="mr-4 hover:underline">Inscription</Link>
            </>
          )}
          <button onClick={toggleTheme} className="hover:underline">
            {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
