#!/bin/bash
set -ex

source ./scripts/set-npm-token.sh

set-npm-token
yarn release-it --ci --config .release-it/.release-it-ci-release.json

