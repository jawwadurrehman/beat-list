import React, { memo, useState } from "react";
import { HandleTodoProps, HandleTodoType, Todo } from "../App";
import EditModeTodoList from "./EditModeTodoList";
import { format } from "date-fns";

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
        <div
            className="todo-list"
            style={{
                backgroundColor: item.isCompleted ? "#efefef" : "white",
                opacity: item.isCompleted ? 0.5 : 1,
                maxHeight: options.todoMaxHeight,
            }}
        >
            {editMode ? (
                <EditModeTodoList item={item} handleTodo={handleTodo} seteditMode={seteditMode} />
            ) : (
                <div
                    style={{
                        marginRight: "20px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onDoubleClick={() => seteditMode((prev) => !prev)}
                >
                    <div className="flex-row" style={{ alignItems: "center", gap:4 }}>
                        <button
                            type="button"
                            onClick={() =>
                                handleTodo({
                                    type: HandleTodoType.UPDATE_IMPORTANT,
                                    payload: {
                                        id: item.id,
                                    },
                                })
                            }
                        >
                            {item.important ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                        fill="#FFBF00"
                                    />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                    />
                                </svg>
                            )}
                        </button>

                        <p
                            style={{
                                textDecoration: item.isCompleted ? "line-through" : "none",
                                fontSize: "0.8rem",
                            }}
                        >
                            {item.title}
                        </p>
                    </div>
                    <pre style={{ fontSize: "13px", lineHeight: 1.4, color: "#000000d0", overflowY: "auto", flex: 1, whiteSpace: "pre-wrap" }}>{item.description}</pre>
                </div>
            )}

            <div className="flex-row" style={{ alignItems: "center" }}>
                <button
                    type="button"
                    onClick={() =>
                        handleTodo({
                            type: HandleTodoType.COMPLETED,
                            payload: {
                                id: item.id,
                            },
                        })
                    }
                >
                    {item.isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </button>
                <button type="button" onClick={() => seteditMode((prev) => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" color="red">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TodoList;
