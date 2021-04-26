#!/bin/bash
set -ex

source ./scripts/set-npm-token.sh
source ./scripts/enable-ssh-git.sh

set-npm-token
set-git-ssh

yarn release-it --ci --config .release-it/.release-it-ci-release.json

