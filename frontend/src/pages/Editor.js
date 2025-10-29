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
      if (!postToEdit || postToEdit.authorId !== currentUser.id) {
        // Pas trouvé ou pas autorisé
        navigate('/dashboard');
        return;
      }
      // Pré-remplit les champs en mode édition
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setPublished(postToEdit.published);
      if (postToEdit.image) {
        setPreview(postToEdit.image);
      }
    }
  }, [currentUser, editing, postToEdit, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">{editing ? "Modifier l'article" : 'Nouvel article'}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Titre" 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <textarea 
          name="content" 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder="Contenu" 
          rows="8" 
          required 
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        ></textarea>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 dark:text-gray-300
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border
                       file:text-sm file:font-semibold
                       file:bg-gray-200 file:text-gray-700
                       dark:file:bg-gray-600 dark:file:text-gray-100"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-4 max-h-64 rounded" />
          )}
        </div>
        <label className="inline-flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={published} 
            onChange={e => setPublished(e.target.checked)} 
            className="h-4 w-4 text-blue-600" 
          />
          <span className="ml-2">Publier</span>
        </label>
        <div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
