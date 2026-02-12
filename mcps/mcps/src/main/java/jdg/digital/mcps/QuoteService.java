package jdg.digital.mcps;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class QuoteService {
    @Tool(description = "Get Kai’s favorite movie quote.")
    public String getKaisFavoriteMovieQuote() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            String accessToken = jwtAuth.getToken().getTokenValue();
            System.out.println("Access token: " + accessToken);
        }
        return "With great power comes great responsibility.";
    }

    public static void main(String[] args) {
        QuoteService client = new QuoteService();
        System.out.println(client.getKaisFavoriteMovieQuote());
    }

}
