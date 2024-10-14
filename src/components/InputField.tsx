import React, { useState, memo } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                <Input placeholder="Task title" value={state.title} onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))} required />
                <Textarea placeholder="Task description (optional)" value={state.description} onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))} />
                <Button className="mt-2 font-bold bg-slate-50 text-slate-800 hover:bg-slate-300" type="submit">Add Task</Button>
        </form>
    );
};

export default memo(InputField);
