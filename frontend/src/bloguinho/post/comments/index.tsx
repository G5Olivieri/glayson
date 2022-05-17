import { CommentResponse } from "@app/bloguinho/post-response";
import Comment from "@app/bloguinho/post/comments/comment";
import React from "react";
import style from "./style.module.scss";

type CommentsProps = {
  comments: CommentResponse[];
  onDelete: (id: string) => void;
};

export default function Comments({ comments, onDelete }: CommentsProps) {
  return (
    <ul className={style.container}>
      {comments.map((p) => (
        <li key={p.id}>
          <Comment comment={p} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
