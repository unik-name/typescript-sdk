#!/bin/bash

set-git-ssh () {
    if [[ -n "$CI" ]];then
        ssh -o StrictHostKeyChecking=no git@github.com || echo "connected"
        git config user.email "ts-sdk-ci@spacelephant.org"
        git config user.name "ts-sdk-circle-ci"
    fi
}
