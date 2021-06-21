### STAGE 1: Build ###
FROM node:12.18.2-alpine AS buildxyz
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli
RUN npm install --save-dev @angular-devkit/build-angular

COPY . .
RUN npm run build
CMD ng serve