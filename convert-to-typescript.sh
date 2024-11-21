#!/bin/bash

# Convert all .js files to .tsx for components
for file in src/components/**/*.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.tsx"
  fi
done

# Convert all .js files to .ts for non-component files
for file in src/{services,stores,utils,hooks}/**/*.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.ts"
  fi
done
