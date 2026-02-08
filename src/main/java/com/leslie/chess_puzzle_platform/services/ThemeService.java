package com.leslie.chess_puzzle_platform.services;

import com.leslie.chess_puzzle_platform.models.Theme;
import com.leslie.chess_puzzle_platform.repository.ThemeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ThemeService {
    final ThemeRepository repository;

    public List<Theme> getAllThemes(){
        return repository.findAll();
    }
}
