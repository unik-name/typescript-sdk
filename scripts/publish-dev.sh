#!/bin/bash

set -ex

source ./scripts/set-npm-token.sh
source ./scripts/enable-ssh-git.sh

set-npm-token
set-git-ssh

PREPATCH=""
# Check if previous version was release or dev
LAST_TAG=$(git describe --tags --abbrev=0)
LAST_DEV_TAG=$(git describe --tags --match "*-dev*" --abbrev=0)
echo "$LAST_TAG" | grep -q dev || PREPATCH="prepatch"
yarn release-it $PREPATCH --preRelease=dev --config .release-it/.release-it-ci-dev.json --ci
# if success, remove last dev tag
test $? -eq 0 && git push origin :"$LAST_DEV_TAG"
