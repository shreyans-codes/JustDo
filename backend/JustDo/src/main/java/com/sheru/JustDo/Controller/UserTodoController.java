package com.sheru.JustDo.Controller;

import com.sheru.JustDo.Model.Todo;
import com.sheru.JustDo.Model.User;
import com.sheru.JustDo.Service.UserService;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/todo")
@CrossOrigin("*")
public class UserTodoController {
    private final UserService userService;

    public UserTodoController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        user.setTodoList(new ArrayList<>());
        return userService.createUser(user);
    }

    @GetMapping("/userDetails")
    public User getUserDetails(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getName();
        User newUser = userService.findById(userId);
        System.out.println(newUser);
        return newUser;
    }

    @GetMapping("{id}")
    public Iterable<Todo> getAllTodo(@PathVariable String id) {
        return userService.getAllTodo(id);
    }

    @PostMapping("/add/{id}")
    public Iterable<Todo> addTodo(@PathVariable String id, @RequestBody String title) {
        return userService.addTodo(id, title);
    }

    @PutMapping("/update/{id}")
    public Iterable<Todo> updateTodo(@PathVariable String id, @RequestBody @NotNull Todo newTodo)
    {
        if(newTodo.getId() == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Please provide a Todo id");
        return userService.updateTodo(id, newTodo);
    }

    @DeleteMapping("/remove/{id}")
    public Iterable<Todo> removeTodo(@PathVariable String id, @RequestBody String todoId) {
        return userService.removeTodo(id, todoId);
    }
}
