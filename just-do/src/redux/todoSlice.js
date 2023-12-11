import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Random ID
import { v4 as uuid } from "uuid";
import { BASE_APPLICATION_URL } from "./authService";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async (payload) => {
    const resp = await fetch(`${BASE_APPLICATION_URL}/${payload.userId}`);
    console.log(payload.userId);
    if (resp.ok) {
      const todos = await resp.json();
      return { todos };
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (payload) => {
    const resp = await fetch(`${BASE_APPLICATION_URL}/add/${payload.userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload.title,
    });

    if (resp.ok) {
      const todos = await resp.json();
      return { todos };
    }
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  "todos/completeTodoAsync",
  async (payload) => {
    const resp = await fetch(
      `${BASE_APPLICATION_URL}/update/${payload.userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: payload.todo.id,
          title: payload.todo.title,
          completed: payload.todo.completed,
        }),
      }
    );

    if (resp.ok) {
      const todos = await resp.json();
      return { todos };
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todos/deleteTodoAsync",
  async (payload) => {
    const resp = await fetch(
      `${BASE_APPLICATION_URL}/remove/${payload.userId}`,
      {
        method: "DELETE",
        body: payload.id,
      }
    );

    if (resp.ok) {
      return { id: payload.id };
    }
  }
);

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    count: 4,
    todoList: [
      { id: uuid(), title: "Make a to do list", completed: false },
      { id: uuid(), title: "Check off the first item", completed: false },
      {
        id: uuid(),
        title: "Realize you already did two things on the list",
        completed: false,
      },
      {
        id: uuid(),
        title: "Reward yourself with a nice cup of coffee",
        completed: false,
      },
    ],
  },
  reducers: {
    addTodo: (state, action) => {
      const todo = {
        id: uuid(),
        title: action.payload,
        completed: false,
      };
      state.todoList.push(todo);
    },
    markComplete: (state, action) => {
      const index = state.todoList.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.todoList[index].completed = action.payload.completed;
    },
    deleteItem: (state, action) => {
      state.todoList = state.todoList.filter((t) => t.id !== action.payload.id);
    },
  },
  extraReducers: {
    [getTodosAsync.fulfilled]: (state, action) => {
      state.todoList = action.payload.todos;
      state.count = state.todoList.length;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.todoList = action.payload.todos;
      state.count += 1;
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      // const index = state.todoList.findIndex(
      //   (todo) => todo.id === action.payload.todo.id
      // );
      // state.todoList[index].completed = action.payload.todo.completed;
      state.todoList = action.payload.todos;
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
      console.log(action.payload.id);
      state.todoList = state.todoList.filter(
        (todo) => todo.id !== action.payload.id
      );
      state.count -= 1;
    },
  },
});

export const { addTodo, markComplete, deleteItem } = todoSlice.actions;

export default todoSlice.reducer;
