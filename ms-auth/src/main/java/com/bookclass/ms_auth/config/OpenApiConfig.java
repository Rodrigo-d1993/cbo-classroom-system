package com.bookclass.ms_auth.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI msAuthOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("ms-auth API")
                        .description("Authentication microservice for CBO Classroom System")
                        .version("v0.0.1"))
                .externalDocs(new ExternalDocumentation().description("Project repository"));
    }
}
