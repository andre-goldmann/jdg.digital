package com.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class ChatConfiguration {

    @Value("${spring.ai.deepseek.api-key}")
    private String apiKey;


}