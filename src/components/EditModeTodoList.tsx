import React, { useState } from "react";
import { HandleTodoProps, HandleTodoType, Todo } from "../App";

interface Props {
  handleTodo({ type, payload }: HandleTodoProps): void;
  seteditMode: React.Dispatch<React.SetStateAction<boolean>>;
  item: Todo;
}

const EditModeTodoList: React.FC<Props> = ({
  handleTodo,
  seteditMode,
  item,
}) => {
  const [input, setinput] = useState<string>(item.title);

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleTodo({
      type: HandleTodoType.EDIT,
      payload: {
        id: item.id,
        title: input,
      },
    });
    seteditMode(false);
  };
  return (
    <form onSubmit={handleFormSubmit} onBlur={handleFormSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setinput(e.target.value)}
      />
    </form>
  );
};

export default EditModeTodoList;
