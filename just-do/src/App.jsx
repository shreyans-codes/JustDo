import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  addTodoAsync,
  getTodosAsync,
  markComplete,
} from "./redux/todoSlice";
import TodoItem from "./components/TodoItem";
import { useEffect, useState } from "react";
import { logout } from "./redux/authService";
import { logoutFromAccount } from "./redux/authSlice";

function App() {
  const count = useSelector((state) => state.todo.count);
  const todos = useSelector((state) => state.todo.todoList);
  console.log(todos, "Count = ", count);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [todoTitle, setTodoTitle] = useState("");
  const userId = authState.user.userId;

  const handleAddTodo = (e) => {
    e.preventDefault();
    dispatch(addTodoAsync({ userId: userId, title: todoTitle }));
    setTodoTitle("");
  };

  const logoutUser = () => {
    dispatch(logoutFromAccount());
  };

  useEffect(() => {
    dispatch(getTodosAsync({ userId: userId }));
  }, [dispatch]);

  return (
    <div className="w-fit m-auto mt-20 text-center" onSubmit={handleAddTodo}>
      <form>
        <div className="flex justify-between mb-2">
          <input
            type="text"
            name="text"
            value={todoTitle}
            className="input w-5/6 m-2"
            autoComplete="false"
            placeholder="What do you want to do?"
            onChange={(e) => setTodoTitle(e.target.value)}
          />
          <button className="submit-button m-2" onClick={handleAddTodo}>
            <span>ADD</span>{" "}
          </button>
        </div>
      </form>
      <div className="Todos">
        {count > 0 &&
          todos.map((todo, id) => (
            <TodoItem
              key={id}
              userId={userId}
              title={todo.title}
              id={todo.id}
              completed={todo.completed}
            />
          ))}
        {count === 0 && <p>No todos</p>}
        <button className="submit-button m-2" onClick={logoutUser}>
          <span>Logout</span>{" "}
        </button>
      </div>
    </div>
  );
}

export default App;
