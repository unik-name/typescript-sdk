#!/bin/bash

set-npm-token () {
    if [[ -n "$CI" ]];then
        echo "Authenticate with registry."
        if [[ -z "$NPM_TOKEN" ]];then
            echo "Error: NPM_TOKEN env var is not set."
            exit 1
        fi

        set +x
        echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc
        set -x
    fi
}
