import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment, commentsApi } from '../services/api';

const ModeratorDashboard: React.FC = () => {
  const [flaggedComments, setFlaggedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlaggedComments();
  }, []);

  const fetchFlaggedComments = async () => {
    try {
      setLoading(true);
      const response = await commentsApi.getFlagged();
      const data: any = response.data;
      const commentsData = data.results || data;
      setFlaggedComments(Array.isArray(commentsData) ? commentsData : []);
      setError(null);
    } catch (err) {
      setError('Failed to load flagged comments.');
      console.error('Error fetching flagged comments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Moderator Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Review flagged content</p>
        </div>
        <Link
          to="/"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
        >
          ← Back to Posts
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {flaggedComments.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Flagged Comments
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {flaggedComments.filter(c => c.text.toLowerCase().includes('spam')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Potential Spam
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {new Set(flaggedComments.map(c => c.post)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Posts Affected
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Flagged Comments for Review
        </h2>

        {flaggedComments.length === 0 ? (
          <div className="text-center py-12 bg-emerald-50 dark:bg-gray-900 rounded-lg border border-emerald-200 dark:border-gray-700">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-emerald-700 dark:text-gray-400 font-medium">
              All clear! No comments flagged for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedComments.map((comment) => (
              <div
                key={comment.id}
                className="border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                      ⚠️ Flagged
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()} at{' '}
                    {new Date(comment.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3 p-3 bg-white dark:bg-gray-900 rounded border border-orange-100 dark:border-gray-800">
                  {comment.text}
                </p>

                <div className="flex items-center gap-2 text-sm mb-4">
                  <Link
                    to={`/posts/${comment.post}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium transition-colors"
                  >
                    View Post →
                  </Link>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-gray-600 dark:text-gray-500">Post ID: {comment.post}</span>
                </div>

                <div className="flex gap-2">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                    ✓ Approve
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm px-4 py-2 rounded-lg transition-colors">
                    ✗ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;