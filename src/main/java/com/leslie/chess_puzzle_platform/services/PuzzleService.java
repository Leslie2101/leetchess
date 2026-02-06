package com.leslie.chess_puzzle_platform.services;


import com.leslie.chess_puzzle_platform.models.Puzzle;
import com.leslie.chess_puzzle_platform.models.Theme;
import com.leslie.chess_puzzle_platform.repository.PuzzleRepository;
import com.leslie.chess_puzzle_platform.repository.ThemeRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final PuzzleRepository puzzleRepository;
    private final ThemeRepository themeRepository;
    private final FileStorageService fileStorageService;

    public Integer uploadPuzzles(MultipartFile file) throws IOException {
        Set<Puzzle> puzzles = parseCSV(file);
        puzzleRepository.saveAll(puzzles);
        return puzzles.size();
    }

    public Page<Puzzle> findAll(Pageable pageable){
        return puzzleRepository.findAll(pageable);
    }


    public Page<Puzzle> searchAndFilter(int ratingMin, int ratingMax, List<String> themes, Pageable pageable){
        if (themes == null || themes.isEmpty()){
            return puzzleRepository.findByRatingBetween(ratingMin, ratingMax, pageable);
        }

        return puzzleRepository.findByAnyThemeAndRating(ratingMin, ratingMax, themes, pageable);
    }

    public void populatePuzzles() throws IOException {
        Resource resource = fileStorageService.loadAsResource("puzzle_aa.csv");
        try (InputStream inputStream = resource.getInputStream()){
            Set<Puzzle> puzzles = parseFromInputStream(inputStream);
            puzzleRepository.saveAll(puzzles);

        }
    }


    private Set<Puzzle> parseFromInputStream(InputStream inputStream){
        try (Reader reader = new BufferedReader(new InputStreamReader(inputStream))){
            HeaderColumnNameMappingStrategy<PuzzleCsvRepresentation> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(PuzzleCsvRepresentation.class);
            CsvToBean<PuzzleCsvRepresentation> csvToBean =
                    new CsvToBeanBuilder<PuzzleCsvRepresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .build();

            return csvToBean.parse()
                    .stream()
                    .map(csvLine -> Puzzle.builder()
                            .fen(csvLine.getFen())
                            .moves(csvLine.getMoves())
                            .rating(csvLine.getRating())
                            .themes(Arrays.stream(csvLine.getThemes().split(" "))
                                    .map(name -> themeRepository.findByName(name)
                                            .orElseGet(() -> themeRepository.save(Theme.builder().name(name).build())))
                                    .collect(Collectors.toSet()))
                            .build())
                    .collect(Collectors.toSet());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Set<Puzzle> parseCSV(MultipartFile file) throws IOException {
        return parseFromInputStream(file.getInputStream());
    }


    public Optional<Puzzle> findById(long puzzleId) {
        return puzzleRepository.findById(puzzleId);
    }
}
