import React, { useEffect, useState, useCallback, useMemo } from "react";
import TodosList from "./components/TodosList";
import "./App.css";
import InputField from "./components/InputField";
import TodosBoxList from "./components/TodosBoxList";

export interface Todo {
  id: number;
  title: string;
  partOf: number;
  isCompleted: boolean;
  startDateTime: number | undefined;
  endDateTime: number | undefined;
  startNotified: boolean;
  endNotified: boolean;
}

export const enum HandleTodoType {
  DELETE,
  EDIT,
  COMPLETED,
  UPDATE_DATE_TIME,
  UPDATE_NOTIFIED,
}

export interface HandleTodoProps {
  type: HandleTodoType;
  payload: {
    id: number;
    title?: string;
    isCompleted?: boolean;
    startDateTime?: number;
    endDateTime?: number;
    isStartDateTime?: boolean;
    date?: string;
    time?: string;
  };
}

export interface TodoBoxType {
  id: number;
  title: string;
}

const App = () => {
  const [todosBox, setTodosBox] = useState<TodoBoxType[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [options, setOptions] = useState({
    todoListSize: "400px",
  });

  const handleAdd = (title: string, partOf: number): void => {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title,
        partOf,
        startDateTime: undefined,
        endDateTime: undefined,
        isCompleted: false,
        startNotified: false,
        endNotified: false,
      },
    ]);
  };

  const handleTodo = useCallback(
    ({ type, payload }: any): void => {
      switch (type) {
        case HandleTodoType.DELETE:
          setTodos(todos.filter((t) => t.id !== payload.id));
          break;
        case HandleTodoType.COMPLETED:
          (function () {
            const cloneTodos = [...todos];

            const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

            cloneTodos[itemIndex] = {
              ...cloneTodos[itemIndex],
              isCompleted: !cloneTodos[itemIndex].isCompleted,
            };

            setTodos(cloneTodos);
          })();

          break;
        case HandleTodoType.EDIT:
          (function () {
            const cloneTodos = [...todos];

            const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

            cloneTodos[itemIndex].title = payload.title || "";

            setTodos([...cloneTodos]);
          })();

          break;
        case HandleTodoType.UPDATE_DATE_TIME:
          (function () {
            const cloneTodos = [...todos];

            const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

            if (payload.isStartDateTime) {
              cloneTodos[itemIndex].startDateTime = new Date(`${payload.date} ${payload.time}`).valueOf();
            } else {
              cloneTodos[itemIndex].endDateTime = new Date(`${payload.date} ${payload.time}`).valueOf();
            }

            setTodos([...cloneTodos]);
          })();

          break;
        case HandleTodoType.UPDATE_NOTIFIED:
          (function () {
            const cloneTodos = [...todos];

            const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

            payload.type === "start" ? (cloneTodos[itemIndex].startNotified = !cloneTodos[itemIndex].startNotified) : (cloneTodos[itemIndex].endNotified = !cloneTodos[itemIndex].endNotified);

            setTodos([...cloneTodos]);
          })();

          break;

        default:
          break;
      }
    },
    [todos]
  );

  const handleAddTodoBox = (title: string) => {
    setTodosBox((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title,
      },
    ]);
  };
  const sortedTodos = useMemo(
    () =>
      todos.sort((a, b) => {
        if (a.isCompleted) return 0;
        if (b.isCompleted) return -1;

        return (a.startDateTime || 0) - (b.startDateTime || 0);
      }),
    [todos]
  );
  const handleInputOptions = (key: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      Notification.requestPermission().then((permission) => {
        console.log(permission);
      });
    }

    const notCompletedTodos = sortedTodos.filter((todos) => !todos.isCompleted && (!todos.startNotified || !todos.endNotified));
    const notifyUserAboutTask = setInterval(() => {
      const currentTime = new Date();

      for (let i = 0; i < notCompletedTodos.length; i++) {
        const todo = notCompletedTodos[i];

        const startDateTime = todo.startDateTime ? new Date(todo.startDateTime) : undefined;
        const endDateTime = todo.endDateTime ? new Date(todo.endDateTime) : undefined;

        if (startDateTime && currentTime >= startDateTime && !todo.startNotified) {
          const timeRemaining = endDateTime ? Math.floor((endDateTime.valueOf() - currentTime.valueOf()) / (1000 * 60)) : "unlimited";
          // Calculate remaining time in minutes
          new Notification(`🚀 TASK "${todo.title}" has started!`, {
            body: `You have ${timeRemaining} minutes left to complete this task.`,
            icon: "task-start-icon.png",
          });
          handleTodo({
            type: HandleTodoType.UPDATE_NOTIFIED,
            payload: {
              id: todo.id,
              type: "start",
            },
          });
        }

        if (endDateTime && currentTime >= endDateTime && currentTime <= new Date(endDateTime.getTime() + 10 * 1000) && !todo.endNotified) {
          new Notification(`🎉 TASK "${todo.title}" has ended!`, {
            body: "Great job! Task completed successfully.",
            icon: "task-end-icon.png",
          });
          handleTodo({
            type: HandleTodoType.UPDATE_NOTIFIED,
            payload: {
              id: todo.id,
              type: "end",
            },
          });
        }
      }
    }, 1000);
    return () => {
      clearInterval(notifyUserAboutTask);
    };
  }, [sortedTodos]);

  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      setTodos(JSON.parse(localTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const localData = localStorage.getItem("todosbox");
    if (localData) {
      setTodosBox(JSON.parse(localData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todosbox", JSON.stringify(todosBox));
  }, [todosBox]);

  useEffect(() => {
    const localData = localStorage.getItem("options");
    if (localData) {
      setOptions(JSON.parse(localData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  return (
    <div className="container">
      <div className="flex flex-row" style={{ alignItems: "center", marginBottom:20 }}>
        <h1 className="title">BeatList</h1>
        <div style={{ marginLeft: 20 }}>
          <input type="text" placeholder="Enter todo list width" onChange={(e) => handleInputOptions("todoListSize", e.target.value)} value={options.todoListSize} />
        </div>
      </div>
      <div className="flex flex-row">
        <TodosBoxList options={options} todosBox={todosBox} todos={todos} handleTodo={handleTodo} handleAdd={handleAdd} />
        <div style={{ fontSize: 30, padding: "0 20px" }} onClick={() => handleAddTodoBox("Ok")}>
          +
        </div>
      </div>
    </div>
  );
};

export default App;
