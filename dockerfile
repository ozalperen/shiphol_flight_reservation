#Each instruction in this file creates a new layer
#Here we are getting our node as Base image
FROM node:16
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /app
#setting working directory in the container
WORKDIR /app
#copying the package.json file(contains dependencies) from project source dir to container dir
COPY ./ /app
# installing the dependencies into the container
RUN yarn install
#RUN yarn build
#copying the source code of Application into the container dir
#container exposed network port number
EXPOSE 8000
#command to run within the container
CMD ["yarn", "start"]