package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.util.UserErrorResponse;
import ru.kata.spring.boot_security.demo.util.UserNotCreatedException;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final UserService userService;

    public ApiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @PostMapping("/users")
    public ResponseEntity<HttpStatus> createUser(@RequestBody @Valid User user,
                                                 BindingResult bindingResult) {
        Optional<User> userByEmail = Optional.ofNullable(userService.getUserByEmail(user.getEmail()));
        if (userByEmail.isPresent()) {
            bindingResult.rejectValue("email", "error.email",
                    "This email is already in use");
        }if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .toList();
            throw new UserNotCreatedException(errorMessages);
        }



        userService.addUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/users")
    public ResponseEntity<HttpStatus> editUser(@RequestBody @Valid User user,
                                               BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .toList();
            throw new UserNotCreatedException(errorMessages);
        }

        userService.editUser(user.getId(), user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(UserNotCreatedException userNotCreatedException) {
        UserErrorResponse response = new UserErrorResponse(userNotCreatedException.getErrors());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}