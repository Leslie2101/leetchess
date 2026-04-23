package com.leslie.chess_puzzle_platform.controllers;


import com.leslie.chess_puzzle_platform.dto.ProfileStatusResponseDTO;
import com.leslie.chess_puzzle_platform.dto.UserInfoDTO;
import com.leslie.chess_puzzle_platform.models.User;
import com.leslie.chess_puzzle_platform.repository.PuzzleAttemptRepository;
import com.leslie.chess_puzzle_platform.repository.UserRepository;
import com.leslie.chess_puzzle_platform.services.PuzzleAttemptService;
import com.leslie.chess_puzzle_platform.services.PuzzleService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class UserController {
    final UserRepository userRepository;
    final PuzzleService puzzleService;
    final PuzzleAttemptService puzzleAttemptService;



    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDTO> getUserInfo(
            @AuthenticationPrincipal OAuth2User principal){

        if (principal == null){
            return ResponseEntity.ok(null);
        }

        System.out.println("PRINCIPAL " + principal);

        UserInfoDTO dto = UserInfoDTO.builder()
                            .name(principal.getAttribute("name"))
                            .email(principal.getAttribute("email"))
                            .pictureUrl(principal.getAttribute("picture"))
                            .build();

        return ResponseEntity.ok(dto);
    }


    @GetMapping("/stats/me")
    public ResponseEntity<ProfileStatusResponseDTO> getStat(@AuthenticationPrincipal OAuth2User principal){
        if (principal == null){
            return new ResponseEntity<>((HttpHeaders) null, HttpStatus.NOT_FOUND);
        }

        Optional<User> optionalUser = userRepository.findByUsername(principal.getAttribute("email"));

        if (optionalUser.isEmpty()){
            return new ResponseEntity<>((HttpHeaders) null, HttpStatus.NOT_FOUND);
        }

        long solved = puzzleAttemptService.getPuzzleSolvedCount(optionalUser.get());
        long total = puzzleService.getPuzzleCount();

        long rating = 0; //todo: calculate rating

        return ResponseEntity.ok(ProfileStatusResponseDTO.builder()
                .solved(solved)
                .rating(rating)
                .unsolved(total - solved)
                .build()
        );

    }

}
