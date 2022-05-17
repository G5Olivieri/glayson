import PostForm from "@app/bloguinho/form";
import { PostResponse } from "@app/bloguinho/post-response";
import Posts from "@app/bloguinho/posts";
import useAuth from "@app/login/use-auth";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";

export default function Bloguinho() {
  const auth = useAuth();
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const [posts, setPosts] = useState<{ data: PostResponse[] }>({ data: [] });

  const onNewPost = (newText: string) => {
    fetch(`${baseUrl}/api/bloguinho/posts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({ text: newText }),
    })
      .then(
        (res) =>
          res.json() as Promise<{
            id: string;
            text: string;
            created_at: string;
          }>
      )
      .then(({ id, text, created_at: createdAt }) =>
        setPosts({
          data: [
            { id, text, created_at: createdAt, comments: [] },
            ...posts.data,
          ],
        })
      );
  };

  const onDelete = (id: string) => {
    fetch(`${baseUrl}/api/bloguinho/posts/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
    }).then(() => setPosts({ data: posts.data.filter((p) => p.id !== id) }));
  };

  useEffect(() => {
    fetch(`${baseUrl}/api/bloguinho/posts`, {
      headers: {
        authorization: `Bearer ${auth.accessToken}`,
      },
    })
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
