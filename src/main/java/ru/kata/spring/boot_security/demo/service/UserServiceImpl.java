package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.Set;

@Transactional(readOnly = true)
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RoleService roleService;

    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder bCryptPasswordEncoder, RoleService roleService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.roleService = roleService;
    }

    @Override
    public User getUserByName(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(
                    String.format("User %s not found", username));
        }
        return user;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void addUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    @Override
    public void editUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(user.getUsername());
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setAge(user.getAge());
            existingUser.setEmail(user.getEmail());
            existingUser.setRoles(user.getRoles());
            userRepository.save(existingUser);
            if (!existingUser.getPassword().equals(user.getPassword())) {
                existingUser.setPassword(
                        bCryptPasswordEncoder.encode(user.getPassword()));
            }
        } else {
            throw new UsernameNotFoundException(
                    String.format("User with id: %s not found", id));
        }
    }

    @Override
    public User getUserById(Long id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            throw new UsernameNotFoundException(
                    String.format("User with id: %s not found", id));
        }
        return existingUser;
    }

    @Override
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user;
    }

}
