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