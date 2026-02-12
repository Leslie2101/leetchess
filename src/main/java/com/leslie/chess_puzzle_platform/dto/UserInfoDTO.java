package com.leslie.chess_puzzle_platform.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
@Getter
public class UserInfoDTO {
    String name;
    String email;
    String pictureUrl;
}
