import React from "react";
import { HandleTodoProps, Todo, TodoBoxType } from "../App";
import TodosList from "./TodosList";
import InputField from "./InputField";

interface TodosBoxListType {
  todosBox: TodoBoxType[];
  todos: Todo[];
  handleTodo({ type, payload }: HandleTodoProps): void;
  handleAdd(title: string, partOf: number): void;
  options: any;
}

const TodosBoxList = ({ options, todosBox, todos, handleTodo, handleAdd }: TodosBoxListType) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 20, width: "100%" }}>
      {todosBox.map((todoBox) => (
        <div key={todoBox.id}>
          {/* <div>{todoBox.title}</div> */}
          <div style={{ width: options.todoListSize }}>
            <TodosList todos={todos.filter((todo) => todo.partOf === todoBox.id)} handleTodo={handleTodo} />
          </div>
          <div style={{ width: options.todoListSize }}>
            <InputField handleAdd={(title) => handleAdd(title, todoBox.id)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodosBoxList;
