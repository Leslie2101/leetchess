package com.leslie.chess_puzzle_platform.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GlobalController {

    @GetMapping("/")
    String sayHello(){
        return "Welcome to Leetchess API server";
    }

}
