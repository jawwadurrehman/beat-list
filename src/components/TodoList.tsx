import React, { memo, useState } from "react";
import { HandleTodoProps, HandleTodoType, Todo } from "../App";
import EditModeTodoList from "./EditModeTodoList";
import { format } from "date-fns";

interface TodoListProps {
  item: Todo;
  handleTodo({ type, payload }: HandleTodoProps): void;
}

const TodoList = ({ item, handleTodo }: TodoListProps) => {
  const [editMode, seteditMode] = useState<boolean>(false);
  const [editDateTime, setEditDateTime] = useState({
    visible: false,
    date: "",
    time: "",
    isStartDateTime: false,
  });

  const startTime = item.startDateTime
    ? format(new Date(item.startDateTime), "hh:mm")
    : "SET";
  const endTime = item.endDateTime
    ? format(new Date(item.endDateTime), "hh:mm")
    : "SET";

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
      }}
    >
      {editMode ? (
        <EditModeTodoList
          item={item}
          handleTodo={handleTodo}
          seteditMode={seteditMode}
        />
      ) : (
        <p
          style={{
            marginRight:'20px',
            textDecoration: item.isCompleted ? "line-through" : "none",
          }}
        >
          {item.title}
        </p>
      )}

      <div className="flex-row">
        {editDateTime.visible && (
          <div style={{ position: "absolute",zIndex:99 }}>
            <div
              style={{
                position: "relative",
                top: 30,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#00000020",
                borderStyle: "solid",
                padding: 10,
                borderRadius: 4,
              }}
            >
              <input
                type="date"
                value={editDateTime.date}
                onChange={(e) =>
                  setEditDateTime((prev) => ({ ...prev, date: e.target.value }))
                }
              />
              <input
                type="time"
                value={editDateTime.time}
                onChange={(e) =>
                  setEditDateTime((prev) => ({ ...prev, time: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={onDateTimeChange}
                style={{
                  backgroundColor: "#2f2f2f",
                  paddingRight: 10,
                  paddingLeft: 10,
                  borderRadius: 4,
                  color: "white",
                }}
              >
                Update
              </button>
            </div>
          </div>
        )}
        
        <button
          type="button"
          onClick={() => {
            setEditDateTime({
              date: item.startDateTime
                ? format(new Date(item.startDateTime), "yyyy-MM-dd")
                : "",
              time: item.startDateTime
                ? format(new Date(item.startDateTime), "HH:mm:ss")
                : "",
              visible: true,
              isStartDateTime: true,
            });
          }}
          style={{
            backgroundColor: "#cbffcb",
            paddingRight: 10,
            paddingLeft: 10,
            borderRadius: 4,
          }}
        >
          {startTime}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setEditDateTime({
              date: item.endDateTime
                ? format(new Date(item.endDateTime), "yyyy-MM-dd")
                : "",
              time: item.endDateTime
                ? format(new Date(item.endDateTime), "HH:mm:ss")
                : "",
              visible: true,
              isStartDateTime: false,
            });
          }}
          style={{
            backgroundColor: "#ffcbcb",
            paddingRight: 10,
            paddingLeft: 10,
            borderRadius: 4,
          }}
        >
          {endTime}
        </button>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            handleTodo({
              type: HandleTodoType.UPDATE_NOTIFIED,
              payload: { id: item.id, isStartDateTime: true },
            })
          }
        >
          {item.startNotified || item.endNotified ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          )}
        </button>
        <button type="button" onClick={() => seteditMode((prev) => !prev)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            color="red"
          >
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
