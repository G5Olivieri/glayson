import { PostResponse } from "@app/bloguinho/post-response";
import Comments from "@app/bloguinho/post/comments";
import CommentForm from "@app/bloguinho/post/form";
import useAuth from "@app/login/use-auth";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import style from "./style.module.scss";

export default function Post() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const auth = useAuth();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostResponse>(null!);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/api/bloguinho/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setIsLoading(false);
      });
  }, []);

  const onNewComment = (newText: string) => {
    fetch(`${baseUrl}/api/bloguinho/posts/${id}/comments`, {
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
            username: string;
          }>
      )
      .then(({ id: commentId, text, created_at: createdAt, username }) =>
        setPost({
          ...post,
          comments: [
            { id: commentId, text, created_at: createdAt, username },
            ...post.comments,
          ],
        })
      );
  };

  const onDelete = (commentId: string) => {
    fetch(`${baseUrl}/api/bloguinho/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
    }).then(() =>
      setPost({
        ...post,
        comments: post.comments.filter((c) => c.id !== commentId),
      })
    );
  };

  if (isLoading) return <div>loading...</div>;

  return (
    <div className={style.container}>
      <div className={style.post}>
        <header className={style.header}>
          {format(parseISO(post.created_at), "dd-MMM")}
        </header>
        <main className={style.main}>{post.text}</main>
      </div>
      <CommentForm onNewComment={onNewComment} />
      <Comments comments={post.comments} onDelete={onDelete} />
    </div>
  );
}
