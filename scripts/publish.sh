#!/bin/bash
set -ex

source ./scripts/set-npm-token.sh

COMMIT_MSG=$(git show-branch --no-name HEAD)
COMMIT_MSG_REGEX="^Release ([0-9]+\.[0-9]+\.[0-9]+)$"

if [[ "$COMMIT_MSG" =~ $COMMIT_MSG_REGEX ]]; then
    VERSION=${BASH_REMATCH[1]}
    echo "Running automated release process for version $VERSION"
    set-npm-token
    yarn release --ci --config .release-it-ci.json
else
    echo "Running nightly publish script"
    ./scripts/publish-nightly.sh
fi
