import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";
import TodosList from "./components/TodosList";
import InputField from "./components/InputField";
import dayjs from "dayjs";
import { Input } from "./components/ui/input";

export interface Todo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    startDateTime: number | undefined;
    endDateTime: number | undefined;
    startNotified: boolean;
    endNotified: boolean;
    createdAt: string;
    important: boolean;
}

export const enum HandleTodoType {
    DELETE,
    EDIT,
    COMPLETED,
    UPDATE_DATE_TIME,
    UPDATE_NOTIFIED,
    UPDATE_IMPORTANT,
}

export interface HandleTodoProps {
    type: HandleTodoType;
    payload: {
        id: number;
        title?: string;
        description?: string;
        isCompleted?: boolean;
        startDateTime?: number;
        endDateTime?: number;
        isStartDateTime?: boolean;
        date?: string;
        time?: string;
    };
}
const getDateNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [options, setOptions] = useState({
        todoListSize: "400px",
        todoMaxHeight: "200px",
    });

    const handleAdd = (title: string, description: string): void => {
        setTodos((prev) => [
            ...prev,
            {
                id: Date.now(),
                title,
                description,
                startDateTime: undefined,
                endDateTime: undefined,
                isCompleted: false,
                startNotified: false,
                endNotified: false,
                createdAt: getDateNow(),
                important: false,
            },
        ]);
    };

    const handleTodo = useCallback(
        ({ type, payload }: any): void => {
            switch (type) {
                case HandleTodoType.DELETE:
                    setTodos(todos.filter((t) => t.id !== payload.id));
                    break;
                case HandleTodoType.COMPLETED:
                    (function () {
                        const cloneTodos = [...todos];

                        const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

                        cloneTodos[itemIndex] = {
                            ...cloneTodos[itemIndex],
                            isCompleted: !cloneTodos[itemIndex].isCompleted,
                        };

                        setTodos(cloneTodos);
                    })();

                    break;
                case HandleTodoType.UPDATE_IMPORTANT:
                    (function () {
                        const cloneTodos = [...todos];

                        const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

                        cloneTodos[itemIndex] = {
                            ...cloneTodos[itemIndex],
                            important: !cloneTodos[itemIndex].important,
                        };

                        setTodos(cloneTodos);
                    })();

                    break;
                case HandleTodoType.EDIT:
                    (function () {
                        const cloneTodos = [...todos];

                        const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

                        cloneTodos[itemIndex].title = payload.title || "";
                        cloneTodos[itemIndex].description = payload.description || "";

                        setTodos([...cloneTodos]);
                    })();

                    break;
                case HandleTodoType.UPDATE_DATE_TIME:
                    (function () {
                        const cloneTodos = [...todos];

                        const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

                        if (payload.isStartDateTime) {
                            cloneTodos[itemIndex].startDateTime = new Date(`${payload.date} ${payload.time}`).valueOf();
                        } else {
                            cloneTodos[itemIndex].endDateTime = new Date(`${payload.date} ${payload.time}`).valueOf();
                        }

                        setTodos([...cloneTodos]);
                    })();

                    break;
                case HandleTodoType.UPDATE_NOTIFIED:
                    (function () {
                        const cloneTodos = [...todos];

                        const itemIndex = cloneTodos.findIndex((t) => t.id === payload.id);

                        payload.type === "start"
                            ? (cloneTodos[itemIndex].startNotified = !cloneTodos[itemIndex].startNotified)
                            : (cloneTodos[itemIndex].endNotified = !cloneTodos[itemIndex].endNotified);

                        setTodos([...cloneTodos]);
                    })();

                    break;

                default:
                    break;
            }
        },
        [todos]
    );

    const sortedTodos = useMemo(
        () =>
            todos.sort((a, b) => {
                if (a.isCompleted && !b.isCompleted) return 1;
                if (!a.isCompleted && b.isCompleted) return -1;

                const dateA = a.createdAt ? new Date(a.createdAt).valueOf() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).valueOf() : 0;

                return dateB - dateA;
            }),
        [todos]
    );
    const handleInputOptions = (key: string, value: string) => {
        setOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
        } else {
            Notification.requestPermission().then((permission) => {
                console.log(permission);
            });
        }

        const notCompletedTodos = sortedTodos.filter((todos) => !todos.isCompleted && (!todos.startNotified || !todos.endNotified));
        const notifyUserAboutTask = setInterval(() => {
            const currentTime = new Date();

            for (let i = 0; i < notCompletedTodos.length; i++) {
                const todo = notCompletedTodos[i];

                const startDateTime = todo.startDateTime ? new Date(todo.startDateTime) : undefined;
                const endDateTime = todo.endDateTime ? new Date(todo.endDateTime) : undefined;

                if (startDateTime && currentTime >= startDateTime && !todo.startNotified) {
                    const timeRemaining = endDateTime ? Math.floor((endDateTime.valueOf() - currentTime.valueOf()) / (1000 * 60)) : "unlimited";
                    // Calculate remaining time in minutes
                    new Notification(`🚀 TASK "${todo.title}" has started!`, {
                        body: `You have ${timeRemaining} minutes left to complete this task.`,
                        icon: "task-start-icon.png",
                    });
                    handleTodo({
                        type: HandleTodoType.UPDATE_NOTIFIED,
                        payload: {
                            id: todo.id,
                            type: "start",
                        },
                    });
                }

                if (endDateTime && currentTime >= endDateTime && currentTime <= new Date(endDateTime.getTime() + 10 * 1000) && !todo.endNotified) {
                    new Notification(`🎉 TASK "${todo.title}" has ended!`, {
                        body: "Great job! Task completed successfully.",
                        icon: "task-end-icon.png",
                    });
                    handleTodo({
                        type: HandleTodoType.UPDATE_NOTIFIED,
                        payload: {
                            id: todo.id,
                            type: "end",
                        },
                    });
                }
            }
        }, 1000);
        return () => {
            clearInterval(notifyUserAboutTask);
        };
    }, [sortedTodos]);

    useEffect(() => {
        const localTodos = localStorage.getItem("todos");
        if (localTodos) {
            setTodos(JSON.parse(localTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        const localData = localStorage.getItem("options");
        if (localData) {
            setOptions(JSON.parse(localData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("options", JSON.stringify(options));
    }, [options]);

    return (
        <div className="h-screen p-4 text-white bg-slate-900">
            <div className="flex flex-row items-center justify-center" style={{ marginBottom: 20 }}>
                <div style={{ height: "50px" }}>
                    <svg style={{ marginTop: "-2%" }} width="100%" height="100%" viewBox="0 0 389.7931034482759 106.20689655172413">
                        <g id="SvgjsG2483" transform="matrix(1.7959770114942528,0,0,1.7959770114942528,16.408045977011493,16.408045977011493)" fill="#ea2088">
                            <g xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <g>
                                        <path d="M26,50c-4.5957031,0-7-12.0737305-7-24s2.4042969-24,7-24s7,12.0737305,7,24S30.5957031,50,26,50z M26,4     c-2.0390625,0-5,8.5703125-5,22s2.9609375,22,5,22s5-8.5703125,5-22S28.0390625,4,26,4z"></path>
                                    </g>
                                    <g>
                                        <path d="M11.3330078,43.8183594c-0.96875,0-1.7373047-0.2822266-2.3027344-0.8476563     c-1.5292969-1.5283203-0.9882813-4.5483398,1.6074219-8.9760742c2.3115234-3.9443359,6.0097656-8.5415039,10.4130859-12.9443359     c4.4023438-4.402832,9-8.1005859,12.9443359-10.4130859c4.4296875-2.5961914,7.4472656-3.1357422,8.9755859-1.6074219     C44.5,10.5581055,43.9589844,13.578125,41.3632813,18.0058594c-2.3125,3.9443359-6.0107422,8.5415039-10.4130859,12.9438477     c-4.4033203,4.402832-9,8.1010742-12.9443359,10.4130859C15.2158203,42.9985352,12.984375,43.8183594,11.3330078,43.8183594z      M40.6552734,10.1918945c-0.9921875,0-2.78125,0.4902344-5.6494141,2.1708984     c-3.8007813,2.2285156-8.2548828,5.815918-12.5410156,10.1015625     c-4.2861328,4.2861328-7.8730469,8.7397461-10.1015625,12.5415039c-2.4707031,4.2148438-2.3691406,6.1005859-1.9189453,6.5507813     s2.3339844,0.5527344,6.5507813-1.9194336c3.8007813-2.2285156,8.2548828-5.815918,12.5410156-10.1015625     s7.8730469-8.7397461,10.1015625-12.5415039c2.4707031-4.2148438,2.3691406-6.1005859,1.9189453-6.550293     C41.4130859,10.300293,41.1220703,10.1918945,40.6552734,10.1918945z"></path>
                                    </g>
                                    <g>
                                        <path d="M26,33c-11.9267578,0-24-2.4042969-24-7s12.0732422-7,24-7s24,2.4042969,24,7S37.9267578,33,26,33z M26,21     c-13.4296875,0-22,2.9614258-22,5s8.5703125,5,22,5s22-2.9614258,22-5S39.4296875,21,26,21z"></path>
                                    </g>
                                    <g>
                                        <path d="M40.6679688,43.8183594c-1.6513672,0-3.8828125-0.8198242-6.6728516-2.4555664     c-3.9443359-2.3120117-8.5410156-6.0102539-12.9443359-10.4130859     c-4.4023438-4.4023438-8.1005859-8.9995117-10.4130859-12.9438477c-2.5957031-4.4277344-3.1367188-7.4477539-1.6074219-8.9760742     c1.5292969-1.5307617,4.5498047-0.9873047,8.9755859,1.6074219c3.9443359,2.3125,8.5419922,6.0102539,12.9443359,10.4130859     c4.4033203,4.402832,8.1015625,9,10.4130859,12.9443359c2.5957031,4.4277344,3.1367188,7.4477539,1.6074219,8.9760742     C42.4052734,43.5361328,41.6367188,43.8183594,40.6679688,43.8183594z M11.3457031,10.1918945     c-0.4667969,0-0.7578125,0.1083984-0.9013672,0.2519531c-0.4501953,0.449707-0.5517578,2.3354492,1.9189453,6.550293     C14.5917969,20.7958984,18.1787109,25.25,22.4648438,29.5356445s8.7402344,7.8730469,12.5419922,10.1015625     c4.2128906,2.4697266,6.0996094,2.3691406,6.5498047,1.9194336c0.4501953-0.4501953,0.5517578-2.3359375-1.9189453-6.5507813     c-2.2285156-3.8017578-5.8154297-8.2553711-10.1015625-12.5415039C25.25,18.1787109,20.7958984,14.5913086,16.9951172,12.362793     C14.1269531,10.6821289,12.3378906,10.1918945,11.3457031,10.1918945z"></path>
                                    </g>
                                </g>
                                <g>
                                    <path d="M26,29c-1.6542969,0-3-1.3457031-3-3s1.3457031-3,3-3s3,1.3457031,3,3S27.6542969,29,26,29z M26,25    c-0.5517578,0-1,0.4487305-1,1s0.4482422,1,1,1s1-0.4487305,1-1S26.5517578,25,26,25z"></path>
                                </g>
                            </g>
                        </g>
                        <g transform="matrix(3.9217571623306418,0,0,3.9217571623306418,121.76442869732739,12.567551724325668)" fill="#ffffff">
                            <path d="M3.92 5.720000000000001 l0.000019531 5.2 l0.04 0 c0.30666 -0.46666 0.74332 -0.84 1.31 -1.12 s1.2167 -0.42 1.95 -0.42 c1.2667 0 2.2966 0.50666 3.09 1.52 s1.19 2.32 1.19 3.92 c0 1.6133 -0.39334 2.9266 -1.18 3.94 s-1.8267 1.52 -3.12 1.52 c-1.68 0 -2.8066 -0.53334 -3.38 -1.6 l-0.04 0 l0 1.32 l-2.7 0 l0 -14.28 l2.84 0 z M3.82 14.84 c0 1 0.21998 1.8 0.65998 2.4 s1.0267 0.9 1.76 0.9 c0.72 0 1.3033 -0.29334 1.75 -0.88 s0.67 -1.3933 0.67 -2.42 c0 -1.0133 -0.21666 -1.82 -0.65 -2.42 s-1.03 -0.9 -1.79 -0.9 c-0.74666 0 -1.3333 0.30666 -1.76 0.92 s-0.64 1.4133 -0.64 2.4 z M17.173000000000002 9.38 c0.97334 0 1.84 0.22664 2.6 0.67998 s1.3567 1.11 1.79 1.97 s0.65 1.85 0.65 2.97 c0 0.10666 -0.0066602 0.28 -0.02 0.52 l-7.46 0 c0.02666 0.82666 0.24332 1.47 0.64998 1.93 s1.03 0.69 1.87 0.69 c0.52 0 0.99666 -0.13 1.43 -0.39 s0.71 -0.57666 0.83 -0.95 l2.5 0 c-0.73334 2.32 -2.3466 3.48 -4.84 3.48 c-0.94666 -0.01334 -1.8233 -0.22 -2.63 -0.62 s-1.45 -1.0233 -1.93 -1.87 s-0.72 -1.83 -0.72 -2.95 c0 -1.0533 0.24334 -2.0134 0.73 -2.88 s1.1333 -1.5133 1.94 -1.94 s1.6767 -0.64 2.61 -0.64 z M19.353 13.719999999999999 c-0.13334 -0.77334 -0.38 -1.3333 -0.74 -1.68 s-0.87334 -0.52 -1.54 -0.52 c-0.69334 0 -1.24 0.19666 -1.64 0.59 s-0.63334 0.93 -0.7 1.61 l4.62 0 z M27.726000000000003 9.38 c3.0134 0.01334 4.52 0.9933 4.52 2.94 l0 5.48 c0 1.0133 0.12 1.7467 0.36 2.2 l-2.88 0 c-0.10666 -0.32 -0.17332 -0.65334 -0.19998 -1 c-0.84 0.85334 -2 1.28 -3.48 1.28 c-1.08 0 -1.9367 -0.27334 -2.57 -0.82 s-0.95 -1.3067 -0.95 -2.28 c0 -0.94666 0.3 -1.68 0.9 -2.2 c0.61334 -0.54666 1.7267 -0.89332 3.34 -1.04 c1.1467 -0.12 1.8733 -0.27 2.18 -0.45 s0.46 -0.45666 0.46 -0.83 c0 -0.46666 -0.14 -0.81332 -0.42 -1.04 s-0.74666 -0.34 -1.4 -0.34 c-0.6 0 -1.0533 0.12334 -1.36 0.37 s-0.48666 0.64332 -0.54 1.19 l-2.84 0 c0.06666 -1.1333 0.53332 -1.9933 1.4 -2.58 s2.0266 -0.88 3.48 -0.88 z M25.366000000000003 17.06 c0 0.88 0.58 1.32 1.74 1.32 c1.52 -0.01334 2.2866 -0.79334 2.3 -2.34 l0 -1.1 c-0.22666 0.22666 -0.8 0.39332 -1.72 0.49998 c-0.8 0.09334 -1.3867 0.25668 -1.76 0.49002 s-0.56 0.61 -0.56 1.13 z M37.139 6.5600000000000005 l0.000019531 3.1 l2.08 0 l0 1.9 l-2.08 0 l0 5.12 c0 0.48 0.08 0.8 0.24 0.96 s0.48 0.24 0.96 0.24 c0.34666 0 0.64 -0.02666 0.88 -0.08 l0 2.22 c-0.4 0.06666 -0.96 0.1 -1.68 0.1 c-1.0933 0 -1.9067 -0.18666 -2.44 -0.56 s-0.8 -1.02 -0.8 -1.94 l0 -6.06 l-1.72 0 l0 -1.9 l1.72 0 l0 -3.1 l2.84 0 z M47.245000000000005 5.720000000000001 l0 14.28 l-2.84 0 l0 -14.28 l2.84 0 z M51.498000000000005 5.720000000000001 l0 2.34 l-2.84 0 l0 -2.34 l2.84 0 z M51.498000000000005 9.66 l0 10.34 l-2.84 0 l0 -10.34 l2.84 0 z M57.071000000000005 9.38 c1.3867 0 2.47 0.28002 3.25 0.84002 s1.2167 1.38 1.31 2.46 l-2.7 0 c-0.04 -0.49334 -0.22 -0.85 -0.54 -1.07 s-0.78666 -0.33 -1.4 -0.33 c-0.53334 0 -0.93 0.08 -1.19 0.24 s-0.39 0.4 -0.39 0.72 c0 0.24 0.08666 0.44 0.26 0.6 s0.43668 0.3 0.79002 0.42 s0.74334 0.22 1.17 0.3 c1.2933 0.25334 2.2066 0.51334 2.74 0.78 s0.92334 0.58666 1.17 0.96 s0.37 0.83334 0.37 1.38 c0 1.16 -0.42334 2.05 -1.27 2.67 s-1.9967 0.93 -3.45 0.93 c-1.52 0 -2.7034 -0.32666 -3.55 -0.98 s-1.2833 -1.54 -1.31 -2.66 l2.7 0 c0 0.53334 0.20666 0.95668 0.62 1.27 s0.93334 0.47 1.56 0.47 c0.53334 0 0.97668 -0.11666 1.33 -0.35 s0.53 -0.55668 0.53 -0.97002 c0 -0.26666 -0.11 -0.48666 -0.33 -0.66 s-0.53 -0.32668 -0.93 -0.46002 s-1.02 -0.28668 -1.86 -0.46002 c-0.66666 -0.13334 -1.26 -0.31334 -1.78 -0.54 s-0.91666 -0.52332 -1.19 -0.88998 s-0.41 -0.81666 -0.41 -1.35 c0 -0.68 0.16334 -1.2733 0.49 -1.78 s0.82666 -0.89 1.5 -1.15 s1.51 -0.39 2.51 -0.39 z M66.26400000000001 6.5600000000000005 l0.000019531 3.1 l2.08 0 l0 1.9 l-2.08 0 l0 5.12 c0 0.48 0.08 0.8 0.24 0.96 s0.48 0.24 0.96 0.24 c0.34666 0 0.64 -0.02666 0.88 -0.08 l0 2.22 c-0.4 0.06666 -0.96 0.1 -1.68 0.1 c-1.0933 0 -1.9067 -0.18666 -2.44 -0.56 s-0.8 -1.02 -0.8 -1.94 l0 -6.06 l-1.72 0 l0 -1.9 l1.72 0 l0 -3.1 l2.84 0 z"></path>
                        </g>
                    </svg>
                </div>
                {/* <div style={{ marginLeft: 20, display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontSize: "12px" }}>Item Max Width:</p>
                        <Input type="text" placeholder="Enter CSS width value" onChange={(e) => handleInputOptions("todoListSize", e.target.value)} value={options.todoListSize} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontSize: "12px" }}>Item Max Height:</p>
                        <Input type="text" placeholder="Enter CSS height value" onChange={(e) => handleInputOptions("todoMaxHeight", e.target.value)} value={options.todoMaxHeight} />
                    </div>
                </div> */}
            </div>
            <div className="max-w-lg mb-8 ml-auto mr-auto">
                <InputField handleAdd={(title, description) => handleAdd(title, description)} />
            </div>
            <div className="flex flex-row" style={{ flex: 1, position: "relative" }}>
                <TodosList todos={sortedTodos} handleTodo={handleTodo} options={options} />
            </div>
        </div>
    );
};

export default App;
