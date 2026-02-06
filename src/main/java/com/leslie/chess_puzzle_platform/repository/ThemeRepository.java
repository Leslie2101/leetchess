package com.leslie.chess_puzzle_platform.repository;

import com.leslie.chess_puzzle_platform.models.Theme;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ThemeRepository extends JpaRepository<Theme, Long> {
    Optional<Theme> findByName(String name);
}
