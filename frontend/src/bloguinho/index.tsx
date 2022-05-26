import PostForm from "@app/bloguinho/form";
import { PostResponse } from "@app/bloguinho/post-response";
import Posts from "@app/bloguinho/posts";
import useAuthFetch from "@app/login/use-auth-fetch";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";

export default function Bloguinho() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const authFetch = useAuthFetch();
  const [posts, setPosts] = useState<{ data: PostResponse[] }>({ data: [] });

  const onNewPost = (newText: string) => {
    authFetch(`${baseUrl}/api/bloguinho/posts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    })
      .then(
        (res) =>
          res.json() as Promise<{
            id: string;
            text: string;
            created_at: string;
            username: string;
          }>
      )
      .then(({ id, text, created_at: createdAt, username }) =>
        setPosts({
          data: [
            { id, text, created_at: createdAt, comments: [], username },
            ...posts.data,
          ],
        })
      );
  };

  const onDelete = (id: string) => {
    authFetch(`${baseUrl}/api/bloguinho/posts/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    }).then(() => setPosts({ data: posts.data.filter((p) => p.id !== id) }));
  };

  useEffect(() => {
    authFetch(`${baseUrl}/api/bloguinho/posts`)
      .then((res) => res.json())
      .then((data) => setPosts({ data }));
  }, []);

  return (
    <div className={style.container}>
      <PostForm onNewPost={onNewPost} />
      <Posts posts={posts.data} onDelete={onDelete} />
    </div>
  );
}
