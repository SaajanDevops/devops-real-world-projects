FROM maven:3.9.9-eclipse-temurin-21-jammy AS build

RUN git clone -b docker https://github.com/SaajanDevops/vprofile-devops.git

WORKDIR /vprofile-devops

RUN mvn install


FROM tomcat:10-jdk21

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=build /vprofile-devops/target/vprofile-v2.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]

