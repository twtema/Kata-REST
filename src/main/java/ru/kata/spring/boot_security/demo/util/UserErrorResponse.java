package ru.kata.spring.boot_security.demo.util;

import java.util.List;

public class UserErrorResponse {

    private List<String> errors;

    public UserErrorResponse(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

}