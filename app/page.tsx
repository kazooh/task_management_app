"use client";

import { useState, useEffect, FormEvent } from "react";
import styles from "./task.module.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // ✅ ページ読み込み時に localStorage からタスクを読み込む
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // ✅ タスクが更新されるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ タスクを追加
  const addTask = (e: FormEvent) => {
    e.preventDefault(); // フォームの自動リロード防止
    if (input.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      title: input,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput(""); // 入力欄をリセット
  };

  // ✅ 完了状態を切り替え
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // ✅ 削除
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>今日のタスク</h1>

      {/* フォームを使うことでEnterキーでも追加可能 */}
      <form onSubmit={addTask} className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          追加
        </button>
      </form>

      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.listItem}>
            <label className={styles.taskLabel}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span
                className={`${styles.taskText} ${
                  task.completed ? styles.completed : ""
                }`}
              >
                {task.title}
              </span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className={styles.deleteButton}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
