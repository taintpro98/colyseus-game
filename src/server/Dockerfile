FROM node:14.18.0-alpine

#set the working directory
WORKDIR /usr/app

# copy current directory to 
ADD . .


# install dependencies
# RUN npm install -g yarn
RUN yarn

EXPOSE 3000

# Run node
RUN yarn dev
# CMD ["npm run", "dev"]

