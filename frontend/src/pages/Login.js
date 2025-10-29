import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/BlogContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { currentUser, login } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const success = login(username, password);
    if (!success) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    } else {
      setError('');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Nom d'utilisateur" 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Mot de passe" 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
      <p className="mt-4 text-center">
        Pas de compte ? <Link to="/signup" className="text-blue-500 hover:underline">Inscrivez-vous</Link>
      </p>
      <p className="mt-2 text-center">
        <Link to="/posts" className="text-gray-500 hover:underline">Voir les articles publics</Link>
      </p>
    </div>
  );
};

export default Login;
