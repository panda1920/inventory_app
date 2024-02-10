#!/bin/bash

SCRIPT_LOCATION=$(cd -P -- $(dirname -- "${BASH_SOURCE[0]:-$0}") && pwd -P)
DOCKERFILE=${SCRIPT_LOCATION}/Dockerfile
PROJECT_ROOT=${SCRIPT_LOCATION}/../..

# check image name is provided through argument
if [[ -z "$1" ]]
then
  echo "Error: Please specify the image name to build"
  echo "Usage: build.sh <image_name>"
  exit 1
fi

# build project
cd $PROJECT_ROOT
npm run build

# build image
echo "Building image..."
docker image build \
  -t $1 \
  -f $DOCKERFILE \
  $PROJECT_ROOT
echo "Image build complete"
