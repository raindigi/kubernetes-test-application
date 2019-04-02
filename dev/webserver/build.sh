#!/bin/bash

TAG=weibeld/test-webserver
docker build -t "$TAG" . && docker push "$TAG"
