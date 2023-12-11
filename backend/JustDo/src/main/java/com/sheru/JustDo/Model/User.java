package com.sheru.JustDo.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table (name = "user")
@Getter
@Setter
public class User {
    @Id
    private String userId;
    private String username;
    private String name;
    @OneToMany (fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Todo> todoList = new ArrayList<>();
}
