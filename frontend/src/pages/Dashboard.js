import React, { useEffect } from 'react';
import { useAppContext } from '../context/BlogContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, posts, deletePost } = useAppContext();
  const navigate = useNavigate();
  const userPosts = posts.filter(p => currentUser && p.authorId === currentUser.id);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet article ?')) {
      deletePost(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes articles</h1>
        <Link to="/editor" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Nouvel article</Link>
      </div>
      {userPosts.length === 0 ? (
        <p>Aucun article pour le moment.</p>
      ) : (
        <ul>
          {userPosts.map(post => (
            <li 
              key={post.id} 
              className="py-2 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between"
            >
              <div>
                <Link to={`/posts/${post.id}`} className="font-semibold hover:underline">
                  {post.title}
                </Link>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  [{post.published ? 'Publié' : 'Brouillon'}]
                </span>
              </div>
              <div>
                <Link to={`/editor/${post.id}`} className="text-blue-500 hover:underline mr-4">Modifier</Link>
                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
