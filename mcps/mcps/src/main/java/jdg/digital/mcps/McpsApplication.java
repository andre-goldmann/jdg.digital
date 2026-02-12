package jdg.digital.mcps;

import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class McpsApplication {
    /*@Bean
    public ToolCallbackProvider tools(
            QuoteService quoteService,
            MovieService movieService,
            WeatherService weatherService) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(quoteService, movieService, weatherService)
                .build();
    }
     */
    @Bean
    public ToolCallbackProvider tools(
            QuoteService quoteService) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(quoteService)
                .build();
    }
    public static void main(String[] args) {
        SpringApplication.run(McpsApplication.class, args);
    }

}
