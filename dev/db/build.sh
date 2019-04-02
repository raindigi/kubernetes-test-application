#!/bin/bash

TAG=weibeld/test-db
docker build -t "$TAG" . && docker push "$TAG"
