package com.leslie.chess_puzzle_platform.controllers;


import com.leslie.chess_puzzle_platform.models.Theme;
import com.leslie.chess_puzzle_platform.services.ThemeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/themes")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class ThemeController {

    final ThemeService themeService;

    @GetMapping
    public List<Theme> getAllThemes(){
        return themeService.getAllThemes();
    }
}
