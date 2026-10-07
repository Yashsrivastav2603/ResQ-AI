# ---------- build ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- run ----------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN useradd -r -u 10001 resqai
COPY --from=build /workspace/target/*.jar app.jar
USER resqai
EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
