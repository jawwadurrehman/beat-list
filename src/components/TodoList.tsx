import React, { memo, useState } from "react";
import { HandleTodoProps, HandleTodoType, Todo } from "../App";
import EditModeTodoList from "./EditModeTodoList";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { Checkbox } from "./ui/Checkbox";
import { Pencil, Trash } from "lucide-react";

interface TodoListProps {
    item: Todo;
    handleTodo({ type, payload }: HandleTodoProps): void;
    options: any;
}

const TodoList = ({ item, handleTodo, options }: TodoListProps) => {
    const [editMode, seteditMode] = useState<boolean>(false);
    const [editDateTime, setEditDateTime] = useState({
        visible: false,
        date: "",
        time: "",
        isStartDateTime: false,
    });

    const startTime = item.startDateTime ? format(new Date(item.startDateTime), "hh:mm") : "SET";
    const endTime = item.endDateTime ? format(new Date(item.endDateTime), "hh:mm") : "SET";

    const onDateTimeChange = () => {
        handleTodo({
            type: HandleTodoType.UPDATE_DATE_TIME,
            payload: {
                id: item.id,
                isStartDateTime: editDateTime.isStartDateTime,
                date: editDateTime.date,
                time: editDateTime.time,
            },
        });
        setEditDateTime({
            visible: false,
            date: "",
            time: "",
            isStartDateTime: false,
        });
    };

    return (
        <div className={cn("bg-slate-800 rounded text-white min-w-80 flex-1 min-h-16 p-4", item.isCompleted && "opacity-60")}>
            {editMode ? (
                <EditModeTodoList item={item} handleTodo={handleTodo} seteditMode={seteditMode} />
            ) : (
                <div onDoubleClick={() => seteditMode((prev) => !prev)} className="flex flex-row h-full">
                    <div className="flex flex-row flex-1 gap-2">
                        <Checkbox
                            checked={item.isCompleted}
                            className="mt-[2px] bg-white/70"
                            onClick={() =>
                                handleTodo({
                                    type: HandleTodoType.COMPLETED,
                                    payload: {
                                        id: item.id,
                                    },
                                })
                            }
                        />
                        <div className="flex flex-col flex-1">
                            <div className="flex flex-row gap-2">
                                <p className={cn("flex-1 text-base", item.isCompleted && "line-through")}>{item.title}</p>

                                <div className="flex flex-row items-start gap-2">
                                    <button type="button" onClick={() => seteditMode((prev) => !prev)}>
                                        <Pencil color="white" size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTodo({
                                                type: HandleTodoType.DELETE,
                                                payload: {
                                                    id: item.id,
                                                },
                                            })
                                        }
                                    >
                                        <Trash color="white" size={16} />
                                    </button>
                                </div>
                            </div>
                            <pre className="flex-1 h-0 overflow-auto font-sans text-sm whitespace-pre-wrap">{item.description}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoList;
