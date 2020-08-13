#!/usr/bin/bash

VERSION=$1

docker build -t lights_ui . && \
docker tag lights_ui eliharper/lights_ui:$VERSION && \
docker push eliharper/lights_ui:$VERSION