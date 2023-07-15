import React, { useState, memo } from "react";

interface Props {
  handleAdd(title: string): void;
}

const InputField: React.FC<Props> = ({ handleAdd }) => {
  const [input, setinput] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input !== "") {
      handleAdd(input);
      setinput("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="todo-input-form">
      <input required
        type="text"
        placeholder="Enter Task"
        onChange={(e) => setinput(e.target.value)}
        value={input}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default memo(InputField);
