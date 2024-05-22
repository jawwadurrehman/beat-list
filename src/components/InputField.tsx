import React, { useState, memo } from "react";

interface Props {
    handleAdd(title: string, description: string): void;
}

const InputField: React.FC<Props> = ({ handleAdd }) => {
    const [state, setState] = useState({
        title: "",
        description: "",
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (state.title !== "") {
            handleAdd(state.title, state.description);
            setState({
                title: "",
                description: "",
            });
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="todo-input-form">
            <input required type="text" placeholder="Enter Task" onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))} value={state.title} />
            <button type="submit">Create</button>
        </form>
    );
};

export default memo(InputField);
