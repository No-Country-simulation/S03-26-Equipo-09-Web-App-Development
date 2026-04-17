package com.startupcrm.crm_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CrmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmBackendApplication.class, args);
	}

}
