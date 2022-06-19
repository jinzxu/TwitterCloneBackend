const app = require('../server');
const request = require('supertest');
const { response } = require('../server');
var token = [];
var tweetID = [];
var userList = [];
var chatList = [];
describe('twitter clone test (Jason Xu: jinzxu@ucalgary.ca)', () => {
    // *****Clear all existing registered users and begin user test in Mongodb Databas*****
    it('*****Clear all existing registered users and begin user test in Mongodb Database*****', async () => {
        await request(app)
            .delete('/register/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (1) Register test: Register new user 1
    it('(1) Register test: should register new user 1 with username of "user1" and Email of "user1@user1.ca"', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User1",
                    "lastName": "User1",
                    "username": "user1",
                    "email": "user1@user1.ca",
                    "password": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
            .then(response => {
                const array = response._body
                userList.push(array[0])
                token.push(array[1])
            })
    });
    // (2) Register test: Register new user 2
    it('(2) Register test: should register new user 2 with username of "user2" and Email of "user2@user2.ca', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User2",
                    "lastName": "User2",
                    "username": "user2",
                    "email": "user2@user2.ca",
                    "password": "654321"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
            .then(response => {
                const array = response._body
                userList.push(array[0])
                token.push(array[1])
            })

    });
    // (3) Register test: Register new user 3
    it('(3) Register test: should register new user 3 with username of "user3" and Email of "user3@user3.ca"', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User3",
                    "lastName": "User3",
                    "username": "user3",
                    "email": "user3@user3.ca",
                    "password": "abcdef"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
            .then(response => {
                const array = response._body
                userList.push(array[0])
                token.push(array[1])
            })

    });
    // (4) Register test: Cannot resgister a user with same username
    it('(4) Register test: should not register a new user with same username like "user1"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User1",
                    "lastName": "User1",
                    "username": "user1",
                    "email": "user1test@user1test.com",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (5) Register test: Cannot resgister a user with same Email
    it('(5) Register test: should not register a new user with same Email like "user3@user3.ca"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Lucy",
                    "lastName": "Glover",
                    "username": "Lucy",
                    "email": "user3@user3.ca",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (6) Register test: should not register a new user with blank username ""
    it('(6) Register test: should not register a new user with blank username ""', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User2",
                    "lastName": "User2",
                    "username": "",
                    "email": "user2@user2.com",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (7) Register test: should not register a new user with invalid email address 
    it('(7) Register test: should not register a new user with invalid email address like "abc"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User2",
                    "lastName": "User2",
                    "username": "user2",
                    "email": "123",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (8) Register test: should not register a new user with passwors less than 6 digits
    it('(8) Register test: should not register a new user with passwors less than 6 digits like "12345"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "User2",
                    "lastName": "User2",
                    "username": "user2",
                    "email": "user2@user2smiht.com",
                    "password": "12345"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (9) Register test: Get all current registered users
    it('(9) Register test: should get all current regisered users', async () => {
        await request(app)
            .get('/register/getall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (10) JWT Authorization Test: should get user with JWT-generated token
    it(`(10) JWT Authorization Test: should get user with JWT-generated token`, async () => {
        await request(app)
            .get('/login')
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (11) Login Test: should let user (username: "user1", password:"123456") log in
    it('(11) Login test: should let user (username: "user1", password:"123456") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "user1",
                    "logPassword": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (12) Login Test: should not let user with invalid username (username: "user1Fake", password:"123") log in
    it('(12) Login test: should not let user with invalid username (username: "user1Fake", password:"123456") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "user1Fake",
                    "logPassword": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (13) Login Test: should not let user with invalid password (username: "user1Fake", password:"fake") log in
    it('(13) Login test: should not let user with invalid password (username: "user1", password:"fakecode") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "user1",
                    "logPassword": "fakecode"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // *****Clear all existing chats and messages in Mongodb Database*****
    it('*****Clear all existing chats and messages in Mongodb Database*****', async () => {
        await request(app)
            .delete('/chat/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (14) Chat test: create group chat
    it('(14) Chat test: create group chat 1 (user1, user2, user3)', async () => {
        const res = await request(app)
            .post('/chat')
            .set('x-auth-token', token[0])
            .send(
                userList
            )
            .expect(200)
            .expect("Content-type", /json/)
        chatList.push(res.body)
    });
    // (15) Chat test: create group chat
    it('(15) Chat test: create group chat 2 (user2, user3)', async () => {
        const res = await request(app)
            .post('/chat')
            .set('x-auth-token', token[1])
            .send(
                [userList[1], userList[2]]
            )
            .expect(200)
            .expect("Content-type", /json/)
        chatList.push(res.body)
    });
    // (16) Chat test: get group chat
    it('(16) Chat test: get all group chats', async () => {
        const res = await request(app)
            .get('/chat')
            .set('x-auth-token', token[0])
            .send(
                userList[0]
            )
            .expect(200)
            .expect("Content-type", /json/)
    });

    // (17) Chat test: get group chat by chat id
    it('(17) Chat test: get group chat by chat id', async () => {
        const res = await request(app)
            .get(`/chat/${chatList[0]._id}`)
            .set('x-auth-token', token[0])
            .send(
                chatList[0]
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (18) Send message test: user1 should be able to send message in chat 1
    it('(18) Send message test: user1 should be able to send message in chat 1', async () => {
        const res = await request(app)
            .post('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[0])
            .send(
                {
                    "content": 'Hello from user 1',
                    "chatId": chatList[0]._id
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (19) Send message test: user1 should not be authorized to send message in chat 2
    it('(19) Send message test: user1 should not be authorized to send message in chat 2', async () => {
        const res = await request(app)
            .post('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[0])
            .send(
                {
                    "content": 'Hello from user 1',
                    "chatId": chatList[1]._id
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (20) Send message test: user2 should be able to send message in chat 1
    it('(20) Send message test: user2 should be able to send message in chat 1', async () => {
        const res = await request(app)
            .post('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[1])
            .send(
                {
                    "content": 'Hello from user 2',
                    "chatId": chatList[0]._id
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });

    // (21) Send message test: user3 should be able to send message in chat 2
    it('(21) Send message test: user3 should be able to send message in chat 2', async () => {
        const res = await request(app)
            .post('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[2])
            .send(
                {
                    "content": 'Hello from user 3',
                    "chatId": chatList[1]._id
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (22) Read message test: user1 should be able to read message in a chat 1
    it('(22) Read message test: user1 should be able to read message in a chat 1', async () => {
        const res = await request(app)
            .get('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[0])
            .send(
                {
                    "chatId": chatList[0]._id
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (23) Read message test: user1 should not be authorized to read message in a chat 2
    it('(23) Read message test: user1 should not be authorized to read message in a chat 2', async () => {
        const res = await request(app)
            .get('/chat/${chatList[0]._id}/messages')
            .set('x-auth-token', token[0])
            .send(
                {
                    "chatId": chatList[1]._id
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // ***** Clear all existing tweets and begin tweet test in Mongodb Database*****
    it('*****Clear all existing tweets and begin tweet test in Mongodb Database*****', async () => {
        await request(app)
            .delete('/tweet/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (24) Create tweet test: user1 should succesfully create a tweet
    it('(24) Create tweet test: user1 should succesfully create a tweet', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('x-auth-token', token[0])
            .send({
                "content": "No. 1 post by user1"
            })
            .expect(200)
            .expect("Content-type", /json/)
        tweetID.push(res.body._id)
    });
    // (24) Create tweet test: user2 should succesfully create a tweet
    it('(24) Create tweet test: user2 should succesfully create a tweet', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('x-auth-token', token[1])
            .send({
                "content": "Tweet 2 by user2"
            })
            .expect(200)
            .expect("Content-type", /json/)
        tweetID.push(res.body._id)
    });
    // (25) Create tweet test: user3 should succesfully create a tweet
    it('(25) Create tweet test: user3 should succesfully create a tweet', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('x-auth-token', token[2])
            .send({
                "content": "Tweet 3 by user3"
            })
            .expect(200)
            .expect("Content-type", /json/)
        tweetID.push(res.body._id)
    });
    // (26) Update tweet test: user1 should succesfully update a tweet
    it('(26) Update tweet test: user1 should succesfully update his own tweet', async () => {
        const res = await request(app)
            .put(`/tweet/${tweetID[0]}`)
            .set('x-auth-token', token[0])
            .send({
                "content": "Updated Tweet 1 by user1"
            })
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (27) Update tweet test: user2 should not be authorized to update user1's tweet
    it("(27) Update tweet test: user2 should not be authorized to update user1's tweet", async () => {
        const res = await request(app)
            .put(`/tweet/${tweetID[0]}`)
            .set('x-auth-token', token[1])
            .send({
                "content": "Updated Tweet 1 by user1"
            })
            .expect(401)
            .expect("Content-type", /json/)
    });
    // (28) Delete tweet test: user1 should not be authorized to delete user3's tweet
    it("(28) Delete tweet test: user1 should not be authorized to delete user3's tweet", async () => {
        const res = await request(app)
            .delete(`/tweet/${tweetID[2]}`)
            .set('x-auth-token', token[0])
            .expect(401)
            .expect("Content-type", /json/)
    });
    // (29) Delete tweet test: user3 should sucessfully delete his own tweet
    it("(29) Delete tweet test: user3 should sucessfully delete his own tweet", async () => {
        const res = await request(app)
            .delete(`/tweet/${tweetID[2]}`)
            .set('x-auth-token', token[2])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (30) Read tweet test: user1 should be able to read all tweets
    it("(30) Read tweet test: user1 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (31) Read tweet test: user2 should be able to read all tweets
    it("(31) Read tweet test: user2 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[1])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (32) Read tweet test: user3 should be able to read all tweets
    it("(32) Read tweet test: user3 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
    });
});
