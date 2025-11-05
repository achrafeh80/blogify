import { useAppContext } from '../context/BlogContext';
import { Link } from 'react-router-dom';

const PublicPosts = () => {
  const { posts, getUserName } = useAppContext();
  const publishedPosts = posts.filter(p => p.published);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Articles publiés</h1>
      {publishedPosts.length === 0 ? (
        <p>Aucun article publié.</p>
      ) : (
        publishedPosts.map(post => (
          <div 
            key={post.id} 
            className="mb-6 p-4 border border-gray-300 rounded dark:border-gray-700"
          >
            <h2 className="text-xl font-bold mb-1">
              <Link to={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Par {getUserName(post.authorId)}
            </p>
            {post.image && (
              <img src={post.image} alt={post.title} className="mb-2 max-h-40 w-full object-cover rounded" />
            )}
            <p className="mb-2">
              {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
            </p>
            <Link to={`/posts/${post.id}`} className="text-blue-500 hover:underline text-sm">
              Lire la suite
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicPosts;
