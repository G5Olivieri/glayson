export type CommentResponse = {
  id: string;
  text: string;
  created_at: string;
};

export type PostResponse = {
  id: string;
  text: string;
  created_at: string;
  comments: CommentResponse[];
};
