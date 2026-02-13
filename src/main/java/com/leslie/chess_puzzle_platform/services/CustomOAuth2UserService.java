package com.leslie.chess_puzzle_platform.services;

import com.leslie.chess_puzzle_platform.dto.UserPrincipal;
import com.leslie.chess_puzzle_platform.models.User;
import com.leslie.chess_puzzle_platform.repository.UserRepository;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class OAuthData {
        String name;
        String id;
        String email;
        String picture;
    }

    @Override
    @SneakyThrows
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oauthUser = super.loadUser(request);
        return processOAuth2User(request, oauthUser);

    }

    private OAuth2User processOAuth2User(OAuth2UserRequest request, OAuth2User oauthUser) {
        OAuthData oAuthData = OAuthData.builder()
                .email(oauthUser.getAttribute("email"))
                .name(oauthUser.getAttribute("name"))
                .picture(oauthUser.getAttribute("picture"))
                .id(oauthUser.getAttribute("sub"))
                .build();

        Optional<User> optionalUser = userRepository.findByUsername(oAuthData.getEmail());
        User user = optionalUser
                .map(existingUser -> updateExistingUser(existingUser, oAuthData))
                .orElseGet(() -> registerNewUser(request, oAuthData));
        return UserPrincipal.create(user, oauthUser.getAttributes());


    }

    private User updateExistingUser(User existingUser, OAuthData oAuthData) {
        existingUser.setName(oAuthData.getName());
        existingUser.setPicture(oAuthData.getPicture());
        return userRepository.save(existingUser);
    }

    private User registerNewUser(OAuth2UserRequest request, OAuthData oAuthData) {
        User user = User.builder()
                .id(UUID.randomUUID())
                .provider(request.getClientRegistration().getRegistrationId())
                .providerId(oAuthData.getId())
                .name(oAuthData.getName())
                .username(oAuthData.getEmail())
                .picture(oAuthData.getPicture())
                .build();
        return userRepository.save(user);
    }
}
