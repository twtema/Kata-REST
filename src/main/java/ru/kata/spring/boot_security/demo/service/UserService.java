package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    User getUserByName(String name);

    List<User> getUsers();

    void addUser(User user);

    void deleteUser(Long id);

    void editUser(Long id, User user);

    User getUserById(Long id);

    User getUserByEmail(String email);


}