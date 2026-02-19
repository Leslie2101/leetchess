# use for build java fie
FROM maven:3.8.4-openjdk-17 AS build
LABEL authors="leslie"

# set the working directory in the container
WORKDIR /app

# copy pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# cpy the source code and build application (compile and build to jar)
# skip tests
COPY src ./src
RUN mvn clean package -DskipTests


# for run the application
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy built JAR file from build stage
COPY --from=build /app/target/chess-puzzle-platform-0.0.1-SNAPSHOT.jar .

# expose port 8082
EXPOSE 8082


# specify command to run the application
ENTRYPOINT ["java", "-jar", "/app/chess-puzzle-platform-0.0.1-SNAPSHOT.jar"]