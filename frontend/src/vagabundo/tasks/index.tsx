import { TaskResponse } from "@app/vagabundo/task-response";
import Task from "@app/vagabundo/tasks/task";
import React from "react";
import style from "./style.module.scss";

export type TasksProps = {
  tasks: TaskResponse[];
  onUpdateTask: (task: TaskResponse) => void;
  onDeleteTask: (task: TaskResponse) => void;
};

export default function Tasks({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TasksProps) {
  return (
    <ul className={style.container}>
      {tasks.map((t) => (
        <li key={t.id}>
          <Task
            task={t}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}
