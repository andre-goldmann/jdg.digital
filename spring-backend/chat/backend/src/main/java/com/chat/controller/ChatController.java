package com.chat.controller;

import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    private final OpenAiChatModel chatModel;

    @Autowired
    public ChatController(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @PostMapping("/ai/generate")
    public Map<String, String> generate(@RequestBody(required = false) MessageRequest request) {
        String message = (request != null && request.getMessage() != null) ? request.getMessage() : "Tell me a joke";
        return Map.of("generation", this.chatModel.call(message));
    }

    @PostMapping("/ai/generateStream")
    public Flux<ChatResponse> generateStream(@RequestBody(required = false) MessageRequest request) {
        String message = (request != null && request.getMessage() != null) ? request.getMessage() : "Tell me a joke";
        Prompt prompt = new Prompt(new UserMessage(message));
        return this.chatModel.stream(prompt);
    }
}

// Helper class to represent the request body
class MessageRequest {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}