import React from 'react';
import { Comment } from '../services/api';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="space-y-4 mt-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`border rounded-lg p-4 ${
            comment.flagged
              ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {comment.author}
              </span>
              {comment.flagged && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                  ⚠️ Flagged for Review
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;