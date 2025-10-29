import React from 'react';
import { useAppContext } from '../context/BlogContext';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { posts, currentUser, getUserName } = useAppContext();
  const { id } = useParams();
  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return <p>Article introuvable.</p>;
  }
  if (!post.published && (!currentUser || currentUser.id !== post.authorId)) {
    return <p>Cet article n'est pas disponible.</p>;
  }

  const authorName = getUserName(post.authorId);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Par {authorName} {post.published ? '' : '(Brouillon)'}
      </p>
      {post.image && (
        <img src={post.image} alt={post.title} className="mb-4 max-w-full rounded" />
      )}
      <div className="whitespace-pre-line">{post.content}</div>
    </div>
  );
};

export default PostDetail;
