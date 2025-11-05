import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/BlogContext';
import { useNavigate, useParams } from 'react-router-dom';

const Editor = () => {
  const { currentUser, posts, createPost, updatePost } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const postToEdit = editing ? posts.find(p => p.id === Number(id)) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (editing) {
      if (!postToEdit) {
        navigate('/dashboard');
        return;
      }
      if (postToEdit.authorId !== currentUser.id) {
        if (currentUser.role !== 'Admin' && !(currentUser.role === 'Editor' && postToEdit.published)) {
          navigate('/dashboard');
          return;
        }
      }
      // Pré-remplit les champs en mode édition
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setPublished(postToEdit.published);
      setPreview(postToEdit.image);
    }
  }, [currentUser, editing, postToEdit, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }
    if (editing) {
      updatePost(postToEdit.id, title, content, preview, published);
    } else {
      createPost(title, content, preview, published);
    }
    navigate('/dashboard');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreview('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{editing ? 'Modifier l’article' : 'Nouvel article'}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Titre" 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Contenu de l’article..." 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" 
          rows="10" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        ></textarea>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
        {preview && <img src={preview} alt="Prévisualisation" className="mb-4 max-h-60 rounded" />}
        <div className="mb-4">
          <label className="mr-2">
            <input 
              type="checkbox" 
              checked={published} 
              onChange={(e) => setPublished(e.target.checked)} 
            /> Publier 
          </label>
          {!published && <span className="text-sm text-gray-600">(Brouillon)</span>}
        </div>
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editing ? 'Enregistrer' : 'Créer'}
        </button>
      </form>
    </div>
  );
};

export default Editor;
