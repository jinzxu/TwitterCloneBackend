# Twitter Backend Clone

## Author

Jason Xu (Email: jinzxu@ucalgary.ca)

## Description

This project is able to clone twitter backend with the following features:

- [x] User registration using unique username and a password.<br>
- [x] User login (Including session maintenance using JWT)<br>
- [x] Chat with other users<br>
- [x] Create, read, update, delete tweet<br>
- [x] Like/unlike a tweet<br>
- [x] Retweet<br>
- [x] Threading<br>
- [x] Test<br>

## Highlights

⭐️ Developed server-side using Node.js and Express, and performed tests using Jest and Supertest

⭐️ Implemented JWT authorization as middleware to ensure only authorized users can deal with their data like tweets.

⭐️ Used MongoDb databse system with Mongoose to manage data including user info, messages and tweets.

⭐️ Designed group chat rooms to send/read messages, which is accessible only by users selected by group creator.

## Technial Stack

`Languages` html/css/javascript

`Technologies` Node.js, Express.js, Mongodb, Jest, Supertest, JWT, bcrypt

`Tools` VSCODE, git, postman

## Running this project

1. `npm i` installs dependencies
2. `npm run server` starts up a hot-reload express webserver on port 3000
3. `npm run test` starts up a test

## Passed Test

54 tests have been passed as follows:
![testPass](https://user-images.githubusercontent.com/104885642/174510423-67b38fc3-67c8-4d73-9df9-fdd1c274371f.png)
