package com.leslie.chess_puzzle_platform.controllers;


import com.leslie.chess_puzzle_platform.dto.UserInfoDTO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/user-info")
    public UserInfoDTO getUserInfo(
            @AuthenticationPrincipal OAuth2User principal){
        return UserInfoDTO.builder()
                .name(principal.getAttribute("name"))
                .email(principal.getAttribute("email"))
                .pictureUrl(principal.getAttribute("picture"))
                .build();
    }

}
