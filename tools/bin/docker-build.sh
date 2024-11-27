#!/bin/bash
set -x

docker-compose stop
docker-compose down

if [ "$1" == "prod" ]; then
    docker-compose build --parallel
else
    for service in "$@"; do
        docker-compose build "$service"
    done
fi

docker-compose up