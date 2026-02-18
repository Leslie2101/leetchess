package com.leslie.chess_puzzle_platform.services;


import com.leslie.chess_puzzle_platform.dto.PuzzleMapper;
import com.leslie.chess_puzzle_platform.dto.PuzzleViewDTO;
import com.leslie.chess_puzzle_platform.models.*;
import com.leslie.chess_puzzle_platform.repository.PuzzleAttemptRepository;
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
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final PuzzleRepository puzzleRepository;
    private final ThemeRepository themeRepository;
    private final FileStorageService fileStorageService;
    private final PuzzleMapper puzzleMapper;
    private final PuzzleAttemptRepository attemptRepository;


    public Long getRandomPuzzleIdByDay(){
        long seed = LocalDate.now().toEpochDay();
        Random randomGenerator = new Random(seed);
        return randomGenerator.nextLong(1, puzzleRepository.count()+1);
    }

    public Integer uploadPuzzles(MultipartFile file) throws IOException {
        List<Puzzle> puzzles = parseCSV(file);
        puzzleRepository.saveAll(puzzles);
        return puzzles.size();
    }

    public Page<Puzzle> findAll(Pageable pageable){
        return puzzleRepository.findAll(pageable);
    }

    public Page<PuzzleViewDTO> getAllPuzzlesForUser(User user,
                                                    int ratingMin, int ratingMax,
                                                    String search,
                                                    List<String> themes,
                                                    Pageable pageable){

        Page<Puzzle> puzzlePage = (themes == null || themes.isEmpty())
                ? (search == null || search.isEmpty())
                    ? puzzleRepository.findByRatingBetween(ratingMin, ratingMax, pageable)
                    : puzzleRepository.findByRatingAndSearch(ratingMin, ratingMax, search, pageable)
                : puzzleRepository.findByAnyThemeAndRating(ratingMin, ratingMax, search, themes, pageable);


        List<Long> puzzleIds = puzzlePage.getContent().stream().map(Puzzle::getId).toList();
        List<PuzzleAttempt> attempts = attemptRepository.findByUserAndPuzzleIds(user.getId(), puzzleIds);

        // group attempts by puzzle id
        Map<Long, List<PuzzleAttempt>> attemptsByPuzzle = attempts.stream()
                .collect(Collectors.groupingBy(pa -> pa.getPuzzle().getId()));

        return puzzlePage.map(puzzle -> {
            List<PuzzleAttempt> puzzleAttempts = attemptsByPuzzle.getOrDefault(puzzle.getId(), List.of());

            PuzzleStatus status = resolveStatus(puzzleAttempts);
            return puzzleMapper.toDTO(puzzle, status);
        });

    }

    private PuzzleStatus resolveStatus(List<PuzzleAttempt> puzzleAttempts) {
        if (puzzleAttempts.isEmpty()) return PuzzleStatus.UNATTEMPTED;

        boolean solved = puzzleAttempts.stream()
                .anyMatch(a -> a.getStatus() == AttemptStatus.SOLVED);

        if (solved) {
            return PuzzleStatus.SOLVED;
        }

        return PuzzleStatus.ATTEMPTED;
    }

    public Page<PuzzleViewDTO> getFilteredPuzzles(int ratingMin, int ratingMax, String search, List<String> themes, Pageable pageable){

        Page<Puzzle> puzzlePage = (themes == null || themes.isEmpty())
                ? (search == null || search.isEmpty())
                    ? puzzleRepository.findByRatingBetween(ratingMin, ratingMax, pageable)
                    : puzzleRepository.findByRatingAndSearch(ratingMin, ratingMax, search, pageable)
                : puzzleRepository.findByAnyThemeAndRating(ratingMin, ratingMax, search, themes, pageable);

        return puzzlePage.map(puzzleMapper::toDTO);
    }

    public void populatePuzzles() throws IOException {
        Resource resource = fileStorageService.loadAsResource("puzzleSetaa.csv");
        try (InputStream inputStream = resource.getInputStream()){
            List<Puzzle> puzzles = parseFromInputStream(inputStream);
            puzzleRepository.saveAll(puzzles);

        }
    }

    public static String getAlliance(Puzzle puzzle){
        return puzzle.getFen().split(" ")[1];
    }


    private List<Puzzle> parseFromInputStream(InputStream inputStream){
        try (Reader reader = new BufferedReader(new InputStreamReader(inputStream))){
            AtomicInteger counter= new AtomicInteger(1);
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
                            .title("Puzzle " + counter.getAndIncrement())
                            .themes(Arrays.stream(csvLine.getThemes().split(" "))
                                    .map(name -> themeRepository.findByName(name)
                                            .orElseGet(() -> themeRepository.save(Theme.builder().name(name).build())))
                                    .collect(Collectors.toSet()))
                            .build())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Puzzle> parseCSV(MultipartFile file) throws IOException {
        return parseFromInputStream(file.getInputStream());
    }


    public Optional<Puzzle> findById(long puzzleId) {
        return puzzleRepository.findById(puzzleId);
    }
}
