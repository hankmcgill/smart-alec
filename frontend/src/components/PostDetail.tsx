import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Post, postsApi } from '../services/api';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const response = await postsApi.getById(postId);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load post. Please try again later.');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    if (id) {
      fetchPost(parseInt(id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to posts
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to posts
      </Link>

      <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </div>
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {post.body}
        </div>
      </article>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({post.comments?.length || 0})
        </h2>

        <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

        {post.comments && post.comments.length > 0 ? (
          <CommentList comments={post.comments} />
        ) : (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;