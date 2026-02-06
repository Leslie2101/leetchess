package com.leslie.chess_puzzle_platform;

import com.leslie.chess_puzzle_platform.services.PuzzleService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ChessPuzzlePlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChessPuzzlePlatformApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(PuzzleService puzzleService){
		return args -> {
			puzzleService.populatePuzzles();
		};
	}
}
