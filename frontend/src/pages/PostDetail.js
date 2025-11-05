// src/pages/PostDetail.js
import React, { useState } from 'react';
import { useAppContext } from '../context/BlogContext';
import { Link, useParams, useNavigate } from 'react-router-dom';

const PostDetail = () => {
  const { posts, currentUser, getUserName, comments, createComment, updateComment, deleteComment, deletePost } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks must be called unconditionally at the top of the component
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // Now compute post (this can be undefined)
  const post = posts.find(p => p.id === Number(id));

  // Early returns are allowed now because hooks were already called
  if (!post) {
    return <p>Article introuvable.</p>;
  }
  if (!post.published && (!currentUser || (currentUser.id !== post.authorId && currentUser.role !== 'Admin'))) {
    return <p>Cet article n'est pas disponible.</p>;
  }

  const authorName = getUserName(post.authorId);

  const handleDeletePost = () => {
    if (window.confirm('Supprimer cet article ?')) {
      deletePost(post.id);
      if (currentUser && currentUser.id === post.authorId) {
        navigate('/dashboard');
      } else {
        navigate('/posts');
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const form = e.target;
    const content = form.content.value;
    if (!content.trim()) {
      return;
    }
    createComment(post.id, content);
    form.reset();
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    if (editingCommentId == null) return;
    updateComment(editingCommentId, editingContent);
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = (id) => {
    if (window.confirm('Supprimer ce commentaire ?')) {
      deleteComment(id);
    }
  };

  const postComments = comments.filter(c => c.postId === post.id);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Par {authorName} {post.published ? '' : '(Brouillon)'}
      </p>
      {currentUser && (currentUser.id === post.authorId || (currentUser.role === 'Editor' && post.published) || currentUser.role === 'Admin') && (
        <div className="text-right mb-4">
          <Link to={`/editor/${post.id}`} className="text-blue-500 hover:underline mr-4">Modifier</Link>
          <button onClick={handleDeletePost} className="text-red-500 hover:underline">Supprimer</button>
        </div>
      )}
      {post.image && (
        <img src={post.image} alt={post.title} className="mb-4 max-w-full rounded" />
      )}
      <div className="whitespace-pre-line mb-8">{post.content}</div>
      <h2 className="text-xl font-bold mb-4">Commentaires</h2>
      {postComments.length === 0 ? (
        <p>Aucun commentaire.</p>
      ) : (
        postComments.map(comment => (
          <div key={comment.id} className="mb-4 p-2 border border-gray-300 rounded dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{getUserName(comment.userId)}</p>
            {editingCommentId === comment.id ? (
              <form onSubmit={handleUpdateComment}>
                <input
                  type="text"
                  name="content"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                <button type="submit" className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 mr-2">Enregistrer</button>
                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600">Annuler</button>
              </form>
            ) : (
              <>
                <p className="mb-1">{comment.content}</p>
                {currentUser && currentUser.id === comment.userId && (
                  <div>
                    <button onClick={() => handleEditComment(comment)} className="text-blue-500 hover:underline mr-4 text-sm">Modifier</button>
                    <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:underline text-sm">Supprimer</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
      {currentUser ? (
        <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            name="content"
            rows="3"
            required
            className="w-full p-2 mb-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Votre commentaire..."
          ></textarea>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Commenter</button>
        </form>
      ) : (
        <p className="mt-2">Connectez-vous pour commenter.</p>
      )}
    </div>
  );
};

export default PostDetail;
