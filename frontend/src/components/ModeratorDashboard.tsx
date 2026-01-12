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
      // Handle both array and paginated responses
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🛡️ Moderator Dashboard
        </h1>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Posts
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-600">
              {flaggedComments.length}
            </div>
            <div className="text-sm text-orange-700 mt-1">
              Flagged Comments
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">
              {flaggedComments.filter(c => c.text.toLowerCase().includes('spam')).length}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Potential Spam
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-600">
              {new Set(flaggedComments.map(c => c.post)).size}
            </div>
            <div className="text-sm text-purple-700 mt-1">
              Posts Affected
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Flagged Comments for Review
        </h2>

        {flaggedComments.length === 0 ? (
          <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-700 font-medium">
              All clear! No comments flagged for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedComments.map((comment) => (
              <div
                key={comment.id}
                className="border border-orange-300 bg-orange-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {comment.author}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
                      🚩 Flagged
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()} at{' '}
                    {new Date(comment.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <p className="text-gray-700 mb-3 p-3 bg-white rounded border border-orange-200">
                  {comment.text}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to={`/posts/${comment.post}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Post →
                  </Link>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Post ID: {comment.post}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition">
                    ✓ Approve
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition">
                    ✗ Delete
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