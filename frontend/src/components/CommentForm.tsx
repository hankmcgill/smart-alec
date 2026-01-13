import React, { useState } from 'react';
import { commentsApi } from '../services/api';

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !text.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await commentsApi.create({
        post: postId,
        author: author.trim(),
        text: text.trim(),
      });

      setSuccess(true);
      setAuthor('');
      setText('');
      
      setTimeout(() => {
        setSuccess(false);
        onCommentAdded();
      }, 1000);
      
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 border-b pb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Comment</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Comment submitted successfully! 🎉
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your name"
          disabled={submitting}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share your thoughts..."
          disabled={submitting}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;