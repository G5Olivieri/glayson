import useAuth from "@app/login/use-auth";
import { TaskResponse } from "@app/vagabundo/task-response";
import Tasks from "@app/vagabundo/tasks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import style from "./style.module.scss";

export default function Vagabundo() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const auth = useAuth();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<{
    data: TaskResponse[];
  }>({ data: [] });

  const updateTask = (task: TaskResponse) => {
    fetch(`${baseUrl}/api/vagabundo/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${auth.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: task.name,
        done: task.done,
      }),
    }).then((res) => {
      if (res.ok) {
        setTasks({
          data: tasks.data.map((tsk) => (tsk.id === task.id ? task : tsk)),
        });
      }
    });
  };

  const deleteTask = (task: TaskResponse) => {
    fetch(`${baseUrl}/api/vagabundo/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${auth.accessToken}`,
      },
    }).then((res) => {
      if (res.ok) {
        setTasks({
          data: tasks.data.filter((tsk) => tsk.id !== task.id),
        });
      }
    });
  };

  useEffect(() => {
    fetch(`${baseUrl}/api/vagabundo/tasks`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks({ data }));
  }, []);

  return (
    <div className={style.container}>
      <h1>Vagabundo</h1>
      <Link to="new" className={style.new}>
        {t("new")}
      </Link>
      <Tasks
        tasks={tasks.data}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
