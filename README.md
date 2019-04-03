# Kubernetes Test Application

## Architecture

## Usage

## Explanation

The files in this respository are divided into a **Dev** and **Ops** section:

- **Dev:** contains the source code and Docker image definitions
    - These are the development artefacts of the application components, as produced by the *developers*.
- **Ops:** contains the Kubernetes configurations
    - These are the code artefacts for deploying and operating the application, as produced by the *operators*.

## Dev

The [`dev`](dev) directory contains source code and Dockerfiles for the Docker images of the two application components:

- [weibeld/test-mongodb](https://cloud.docker.com/u/weibeld/repository/docker/weibeld/test-mongodb)
- [weibeld/test-webserver](https://cloud.docker.com/u/weibeld/repository/docker/weibeld/test-webserver)

### Database

The [weibeld/test-mongodb](https://cloud.docker.com/u/weibeld/repository/docker/weibeld/test-mongodb) image is a MongoDB database that only augments the standard [mongo](https://hub.docker.com/_/mongo) image with some default data that is automatically inserted into the database (the string that will be served by the web server).

The image requires the following environment variables:

- `MONGO_INITDB_ROOT_USERNAME`: username for the MongoDB server
- `MONGO_INITDB_ROOT_PASSWORD`: password for the MongoDB server
- `STRING`: default string to save in the database (will be served by the web server)
- `MONGODB_DB`: MongoDB database to save the default string to
- `MONGODB_COLLECTION`: MongoDB collection to save he default string to

### Web server

The [weibeld/test-webserver](https://cloud.docker.com/u/weibeld/repository/docker/weibeld/test-webserver) image is a simple web server that listens on port 8080. On each request, the web server connects to the above MongoDB database, retrieves the default string, and returns it to the caller.

This image requires the following environment variables:

- `MONGODB_HOST`: DNS hostname or IP address of the MongoDB server
- `MONGODB_USERNAME`: username for the MongoDB server
- `MONGODB_PASSWORD`: password for the MongoDB server
- `MONGODB_DB`: MongoDB database where the default string is saved
- `MONGODB_COLLECTION`: MongoDB collection where the default string is saved

### Run locally

You can run the application locally with Docker as follows:

~~~bash
# Create network allowing the database and web server containers to communicate
docker network create test-net

# Run the database
docker run --name mongodb-container --network test-net \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -e STRING="Hello World!" \
  -e MONGODB_DB=mydb \
  -e MONGODB_COLLECTION=mydata \
  weibeld/test-mongodb

# Run the webserver
docker run -p 8080:8080 --network test-net \
  -e MONGODB_HOST=mongodb-container \
  -e MONGODB_USERNAME=admin \
  -e MONGODB_PASSWORD=secret \
  -e MONGODB_DB=mydb \
  -e MONGODB_COLLECTION=mydata\
  weibeld/test-webserver
~~~

Acces the application with `curl http://127.0.0.1:8080` or by opening <http://127.0.0.1:8080> in a web browser.

### Ops
