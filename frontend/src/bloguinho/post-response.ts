export type CommentResponse = {
  id: string;
  text: string;
  created_at: string;
  username: string;
};

export type PostResponse = {
  id: string;
  text: string;
  created_at: string;
  username: string;
  comments: CommentResponse[];
};
