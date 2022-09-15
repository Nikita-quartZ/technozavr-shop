#!usr/bin/env bash

set -env

npm run build

cd dist

git init
git add -addgit commit -m "deploy"

git push -f https://github.com/Nikita-quartZ/vue-app.git master:gh-pages

cd -