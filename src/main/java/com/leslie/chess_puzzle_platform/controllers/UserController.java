package com.leslie.chess_puzzle_platform.controllers;


import com.leslie.chess_puzzle_platform.dto.UserInfoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

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

}
