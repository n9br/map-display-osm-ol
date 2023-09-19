
pull Lat/Lon Coords from our API and display the points on an OSM map + layer

+ Development

* npm init
* npm i
* (npm i --save-dev parcel ol)
* npm start

+ Github Actions

* add AWS Secrets

s3-deploy.yml:

name: s3-deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Build Node App
        run: npm install && npm run build
      - name: Deploy app build to S3 bucket
        run: aws s3 sync ./dist/ s3://projekt-eb-test --delete

