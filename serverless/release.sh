#!/bin/bash

rm -f "serverless.yml"
cp "./serverless/$1.yml" "serverless.yml"

echo "Publish for env $1"

sls --debug

rm "serverless.yml"
