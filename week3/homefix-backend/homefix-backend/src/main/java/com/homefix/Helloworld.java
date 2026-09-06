package com.homefix;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Helloworld {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World! HomeFix Backend is Working!";
    }
    @GetMapping("/test")
    public String test() {
        return "Test endpoint is working!";
    }
}