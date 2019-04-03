#!/bin/bash

TAG=weibeld/test-mongodb
docker build -t "$TAG" . && docker push "$TAG"
