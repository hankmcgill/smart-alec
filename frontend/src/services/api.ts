import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
  comment_count: number;
  flagged_comment_count: number;
}

export interface Comment {
  id: number;
  post: number;
  author: string;
  text: string;
  flagged: boolean;
  created_at: string;
}

export interface CreateCommentDto {
  post: number;
  author: string;
  text: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const postsApi = {
  getAll: () => api.get<PaginatedResponse<Post>>('/posts/'),
  getById: (id: number) => api.get<Post>(`/posts/${id}/`),
  create: (data: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'comments' | 'comment_count' | 'flagged_comment_count'>) => 
    api.post<Post>('/posts/', data),
};

export const commentsApi = {
  getAll: (postId?: number) => {
    const params = postId ? { post: postId } : {};
    return api.get<PaginatedResponse<Comment>>('/comments/', { params });
  },
  getFlagged: () => api.get<PaginatedResponse<Comment> | Comment[]>('/comments/flagged/'),
  create: (data: CreateCommentDto) => api.post<Comment>('/comments/', data),
  approve: (id: number) => api.patch<Comment>(`/comments/${id}/`, { flagged: false }),
  remove: (id: number) => api.delete(`/comments/${id}/`),
};

export default api;