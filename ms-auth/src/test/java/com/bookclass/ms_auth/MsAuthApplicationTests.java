package com.bookclass.ms_auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// FIX: NONE evita levantar el servidor web completo, haciendo el smoke test más rápido
// y aislado de dependencias externas (Eureka, config server, etc.) si se agregan en el futuro.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class MsAuthApplicationTests {

    @Test
    void contextLoads() {
    }

}