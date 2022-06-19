const app = require('../server');
const request = require('supertest');
var token = [];
var tweetID = [];
describe('twitter clone test', () => {
    // (1) *****Clear all existing registered users and begin user test*****
    it('(1) *****Clear all existing registered users and begin user test*****', async () => {
        await request(app)
            .delete('/register/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (2) Register test: Register new user 1
    it('(2) Register test: should register new user 1 with username of "user1" and Email of "user1@user1.ca"', async () => {
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
        token.push(res.body.token)
    });
    // (3) Register test: Register new user 2
    it('(3) Register test: should register new user 2 with username of "user2" and Email of "user2@user2.ca', async () => {
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
        token.push(res.body.token)
    });
    // (4) Register test: Register new user 3
    it('(4) Register test: should register new user 3 with username of "user3" and Email of "user3@user3.ca"', async () => {
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
        token.push(res.body.token)
    });

    // (5) Register test: Cannot resgister a user with same username
    it('(5) Register test: should not register a new user with same username like "user1"', async () => {
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
    // (6) Register test: Cannot resgister a user with same Email
    it('(6) Register test: should not register a new user with same Email like "user3@user3.ca"', async () => {
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

    // (7) Register test: should not register a new user with blank username ""
    it('(7) Register test: should not register a new user with blank username ""', async () => {
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

    // (8) Register test: should not register a new user with invalid email address 
    it('(8) Register test: should not register a new user with invalid email address like "abc"', async () => {
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

    // (9) Register test: should not register a new user with passwors less than 6 digits
    it('(9) Register test: should not register a new user with passwors less than 6 digits like "12345"', async () => {
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

    // (10) Register test: Get all current registered users
    it('(10) Register test: should get all current regisered users', async () => {
        await request(app)
            .get('/register/getall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (11) JWT Authorization Test: should get user with JWT-generated token
    it(`(11) JWT Authorization Test: should get user with JWT-generated token`, async () => {
        await request(app)
            .get('/login')
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
        console.log(token)
    });


    // (12) Login Test: should let user (username: "user1", password:"123456") log in
    it('(12) Login test: should let user (username: "user1", password:"123456") log in', async () => {
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
    // (13) Login Test: should not let user with invalid username (username: "user1Fake", password:"123") log in
    it('(13) Login test: should not let user with invalid username (username: "user1Fake", password:"123456") log in', async () => {
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
    // (14) Login Test: should not let user with invalid password (username: "user1Fake", password:"fake") log in
    it('(14) Login test: should not let user with invalid password (username: "user1", password:"fakecode") log in', async () => {
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
    // (15) ***** Clear all existing tweets and begin tweet test *****
    it('(15) *****Clear all existing tweets and begin tweet test*****', async () => {
        await request(app)
            .delete('/tweet/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (16) Create tweet test: user1 should succesfully create a tweet
    it('(16) Create tweet test: user1 should succesfully create a tweet', async () => {
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
    // (17) Create tweet test: user2 should succesfully create a tweet
    it('(17) Create tweet test: user2 should succesfully create a tweet', async () => {
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
    // (18) Create tweet test: user3 should succesfully create a tweet
    it('(18) Create tweet test: user3 should succesfully create a tweet', async () => {
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
    // (19) Update tweet test: user1 should succesfully update a tweet
    it('(19) Update tweet test: user1 should succesfully update his own tweet', async () => {
        const res = await request(app)
            .put(`/tweet/${tweetID[0]}`)
            .set('x-auth-token', token[0])
            .send({
                "content": "Updated Tweet 1 by user1"
            })
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (20) Update tweet test: user2 should not be authorized to update user1's tweet
    it("(20) Update tweet test: user2 should not be authorized to update user1's tweet", async () => {
        const res = await request(app)
            .put(`/tweet/${tweetID[0]}`)
            .set('x-auth-token', token[1])
            .send({
                "content": "Updated Tweet 1 by user1"
            })
            .expect(401)
            .expect("Content-type", /json/)
    });
    // (21) Delete tweet test: user1 should not be authorized to delete user3's tweet
    it("(21) Delete tweet test: user1 should not be authorized to delete user3's tweet", async () => {
        const res = await request(app)
            .delete(`/tweet/${tweetID[2]}`)
            .set('x-auth-token', token[0])
            .expect(401)
            .expect("Content-type", /json/)
    });
    // (22) Delete tweet test: user3 should sucessfully delete his own tweet
    it("(22) Delete tweet test: user3 should sucessfully delete his own tweet", async () => {
        const res = await request(app)
            .delete(`/tweet/${tweetID[2]}`)
            .set('x-auth-token', token[2])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (23) Read tweet test: user1 should be able to read all tweets
    it("(23) Read tweet test: user1 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (24) Read tweet test: user2 should be able to read all tweets
    it("(24) Read tweet test: user2 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[1])
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (25) Read tweet test: user3 should be able to read all tweets
    it("(25) Read tweet test: user3 should be able to read all tweets", async () => {
        const res = await request(app)
            .get(`/tweet`)
            .set('x-auth-token', token[0])
            .expect(200)
            .expect("Content-type", /json/)
    });
});
