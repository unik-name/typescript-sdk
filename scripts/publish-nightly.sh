#!/bin/bash

set -ex

source ./scripts/set-npm-token.sh

# Check new commits since 24h
if [ $(git log --since="1 day" | wc -l) -eq 0 ]; then
    echo "Nothing to publish since 1 day.";
    exit 0;
fi

# Check current version format
version=$(grep '"version":' package.json | cut -d\" -f4)
name=$(grep '"name":' package.json | cut -d\" -f4)
if [[ $version =~ "-" ]]; then
    echo "Version format is not X.Y.Z ($version)"
    exit 1
fi

echo "Bump package version."
DATE=$(date -u +%Y%m%d%H%M%S)
dev="-dev.$DATE"
sed  -i.bak '/version/s/[^0-9]*$/'"$dev\",/" package.json

set-npm-token

echo "Publish package"
npm publish --tag=dev
