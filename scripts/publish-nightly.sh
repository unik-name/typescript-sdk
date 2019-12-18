#!/bin/bash

set -e

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
DATE=$(date +%Y%m%d)
dev="-dev.$DATE"
sed  -i.bak '/version/s/[^0-9]*$/'"$dev\",/" package.json

echo "Authenticate with registry."
if [[ -z "$NPM_TOKEN" ]];then
    echo "Error: NPM_TOKEN is not set."
    exit 1
fi
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc

echo "Publish package"
npm publish --tag=dev

echo "Add dist-tags @next"
npm dist-tag add $name@$version$dev next