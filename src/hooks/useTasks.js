
import { useContext } from "react";
import { TaskContext } from "../context/taskContext";

export function useTasks() {
  const context = useContext(TaskContext);

  if (context === null) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
}
