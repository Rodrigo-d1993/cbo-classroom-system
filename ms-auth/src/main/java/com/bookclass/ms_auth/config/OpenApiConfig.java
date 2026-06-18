package com.bookclass.ms_auth.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI msAuthOpenAPI() {
        // Register a Bearer JWT security scheme so the Swagger UI shows the "Authorize" button.
        // We don't apply a global SecurityRequirement here so public endpoints (eg. /auth/login)
        // remain usable without authentication in the docs, but the scheme will be available
        // for testing protected endpoints via the Swagger UI.
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name("Authorization")
                        )
                )
                .info(new Info().title("ms-auth API")
                        .description("Authentication microservice for CBO Classroom System")
                        .version("v0.0.1"))
                .externalDocs(new ExternalDocumentation().description("Project repository"));
    }
}
