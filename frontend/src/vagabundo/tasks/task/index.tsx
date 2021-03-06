import { TaskResponse } from "@app/vagabundo/task-response";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type TaskProps = {
  task: TaskResponse;
  onUpdateTask: (task: TaskResponse) => void;
  onDeleteTask: (task: TaskResponse) => void;
};

export default function Task({ task, onUpdateTask, onDeleteTask }: TaskProps) {
  const { t } = useTranslation();
  const [done, setDone] = useState(task.done);

  const onChange = () => {
    onUpdateTask({
      ...task,
      done: !done,
    });
    setDone(!done);
  };

  return (
    <div className={style.container}>
      <input
        className={style.inputDone}
        type="checkbox"
        checked={done}
        onChange={onChange}
        name="done"
        id={task.id}
      />
      <label htmlFor={task.id} className={style.name}>
        {task.name}
      </label>
      <button type="button" onClick={() => onDeleteTask(task)}>
        {t("delete")}
      </button>
    </div>
  );
}
