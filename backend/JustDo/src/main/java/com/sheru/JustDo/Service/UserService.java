package com.sheru.JustDo.Service;

import com.sheru.JustDo.Model.Todo;
import com.sheru.JustDo.Model.User;
import com.sheru.JustDo.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if(existingUser.isPresent())
        {
            throw new RuntimeException("User already registered. Please use different username.");
        }
        userRepository.save(user);
        return user;
    }

    public User createSSOUser(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if(existingUser.isPresent())
        {
            return existingUser.get();
        }
        userRepository.save(user);
        return user;
    }

    public User findById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find the user"));
    }

    public Iterable<Todo> getAllTodo(String id) {
        Optional<User> foundUser = userRepository.findById(id);
        if(foundUser.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        System.out.println("Here and response: " + foundUser.get().getTodoList());
        return foundUser.get().getTodoList();
    }

    public Iterable<Todo> addTodo(String id,String title) {
        Optional<User> foundUser = userRepository.findById(id);
        if(foundUser.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        User newUser = foundUser.get();
        List<Todo> todoList = newUser.getTodoList();
        UUID uuid = UUID.randomUUID();
        Todo todo = new Todo(uuid.toString(), title, false);
        todoList.add(todo);
        newUser.setTodoList(todoList);
        userRepository.save(newUser);
        //TODO: Should return todo list from database
        return todoList;
    }

    public Iterable<Todo> updateTodo(String id, Todo newTodo)
    {
        Optional<User> foundUser = userRepository.findById(id);
        if(foundUser.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        User newUser = foundUser.get();
        List<Todo> todoList = newUser.getTodoList();
        Optional<Todo> foundTodo = todoList.stream().filter(todo -> todo.getId().equals(newTodo.getId())).findFirst();
        todoList.set(todoList.indexOf(foundTodo.get()), newTodo);
        newUser.setTodoList(todoList);
        userRepository.save(newUser);
        //TODO: Should return todo list from database
        return todoList;
    }

    public Iterable<Todo> removeTodo(String id,String todoId) {
        Optional<User> foundUser = userRepository.findById(id);
        if(foundUser.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        User newUser = foundUser.get();
        List<Todo> todoList = newUser.getTodoList();
        Optional<Todo> foundTodo = todoList.stream().filter(todo -> todo.getId().equals(todoId)).findFirst();
        todoList.remove(foundTodo.get());
        newUser.setTodoList(todoList);
        userRepository.save(newUser);
        //TODO: Should return todo list from database
        return todoList;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return (UserDetails) userRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Username not found!"));
    }
}
