import React, { useState } from "react";
import { HandleTodoProps, HandleTodoType, Todo } from "../App";

interface Props {
    handleTodo({ type, payload }: HandleTodoProps): void;
    seteditMode: React.Dispatch<React.SetStateAction<boolean>>;
    item: Todo;
}

const EditModeTodoList: React.FC<Props> = ({ handleTodo, seteditMode, item }) => {
    const [state, setState] = useState({
        title: item.title,
        description: item.description,
    });

    const handleFormSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        handleTodo({
            type: HandleTodoType.EDIT,
            payload: {
                id: item.id,
                title: state.title,
                description: state.description,
            },
        });
        seteditMode(false);
    };
    return (
        <form onSubmit={handleFormSubmit} onBlur={handleFormSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input type="text" value={state.title} onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))} />
                <textarea value={state.description} onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
        </form>
    );
};

export default EditModeTodoList;
