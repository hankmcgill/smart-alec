import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, postsApi } from '../services/api';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsApi.getAll();
      // Handle paginated response
      const data: any = response.data;
      const postsData = data.results || data;
      setPosts(Array.isArray(postsData) ? postsData : []);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Posts</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Browse articles and join the discussion</p>
        </div>
        <Link
          to="/moderator"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Moderator Dashboard
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all p-6 group"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{post.body}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  💬 {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                </span>
                {post.flagged_comment_count > 0 && (
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-500">
                    ⚠️ {post.flagged_comment_count} flagged
                  </span>
                )}
                <span>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;