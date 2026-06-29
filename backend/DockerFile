# Dev — compile et lance Spring Boot (pas de .jar, hot reload via spring-boot:run)
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src

EXPOSE 8085

CMD ["./mvnw", "spring-boot:run"]
