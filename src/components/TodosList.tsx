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
    <div>
      {todos.map((todo) => {
        return <TodoList key={todo.id} item={todo} handleTodo={handleTodo} options={options} />;
      })}
    </div>
  );
};

export default TodosList;
