#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

pipenv run pip install tomli==2.0.1

pipenv run migrate

pipenv run upgrade
