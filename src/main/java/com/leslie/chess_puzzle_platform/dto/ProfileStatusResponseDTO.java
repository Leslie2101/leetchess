package com.leslie.chess_puzzle_platform.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Getter
@Data
public class ProfileStatusResponseDTO {
    long rating;
    long solved;
    long unsolved;
}
