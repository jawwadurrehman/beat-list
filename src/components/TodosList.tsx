import React from "react";
import { HandleTodoProps, Todo } from "../App";
import TodoList from "./TodoList";

interface Props {
  todos: Todo[];
  handleTodo({ type, payload }: HandleTodoProps): void;
  options: any;
}

const TodosList: React.FC<Props> = ({ todos, handleTodo, options }) => {
  return (
    <div className="flex flex-row flex-wrap items-start gap-3">
      {todos.map((todo) => {
        return <TodoList key={todo.id} item={todo} handleTodo={handleTodo} options={options} />;
      })}
    </div>
  );
};

export default TodosList;
