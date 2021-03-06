import React from "react";
import { PostResponse } from "@app/bloguinho/post-response";
import Post from "@app/bloguinho/posts/post";
import style from "./style.module.scss";

type PostsProps = {
  posts: PostResponse[];
  onDelete: (id: string) => void;
};

export default function Posts({ posts, onDelete }: PostsProps) {
  return (
    <ul className={style.container}>
      {posts.map((p) => (
        <li key={p.id}>
          <Post post={p} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
