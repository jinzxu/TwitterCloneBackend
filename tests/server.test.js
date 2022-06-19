const app = require('../server');
const request = require('supertest');
var token = "";
describe('twitter clone test', () => {
    // (1) Register test: Delete all current registered users
    it('(1) Register test: should delete all current regisered users', async () => {
        await request(app)
            .delete('/register/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (2) Register test: Register a user
    it('(2) Register test: should register a new user with username of "jasonxu" and Email of "jasonxu@jasonxu.ca"', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jason",
                    "lastName": "Xu",
                    "username": "jasonxu",
                    "email": "jasonxu@jasonxu.ca",
                    "password": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
        token = res.body.token
    });
    // (3) Register test: Cannot resgister a user with same username
    it('(3) Register test: should not register a new user with same username of "jasonxu"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jason",
                    "lastName": "Xu",
                    "username": "jasonxu",
                    "email": "jasonxutest1@jasonxu.com",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (4) Register test: Cannot resgister a user with same Email
    it('(4) Register test: should not register a new user with same Email of "jasonxu@jasonxu.ca"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jason",
                    "lastName": "Xu",
                    "username": "jasonxutest1",
                    "email": "jasonxu@jasonxu.ca",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (5) Register test: should not register a new user with blank username ""
    it('(5) Register test: should not register a new user with blank username ""', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "John",
                    "lastName": "Smith",
                    "username": "",
                    "email": "johnsmith@johnsmith.com",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (6) Register test: should not register a new user with invalid email address 
    it('(6) Register test: should not register a new user with invalid email address like "abc"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "John",
                    "lastName": "Smith",
                    "username": "johnsmith",
                    "email": "123",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (7) Register test: should not register a new user with passwors less than 6 digits
    it('(7) Register test: should not register a new user with passwors less than 6 digits like "12345"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "John",
                    "lastName": "Smith",
                    "username": "johnsmith",
                    "email": "johnsmith@johnsmiht.com",
                    "password": "12345"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });

    // (8) Register test: Get all current registered users
    it('(8) Register test: should get all current regisered users', async () => {
        await request(app)
            .get('/register/getall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (9) JWT Authorization Test: should get user with JWT-generated token
    it(`(9) JWT Authorization Test: should get user with JWT-generated token`, async () => {
        await request(app)
            .get('/login')
            .set('x-auth-token', token)
            .expect(200)
            .expect("Content-type", /json/)
    });


    // (10) Login Test: should let user (username: "jasonxu", password:"123") log in
    it('(10) Login test: should let user (username: "jasonxu", password:"123") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jasonxu",
                    "logPassword": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (11) Login Test: should not let user with invalid username (username: "jasonxuFake", password:"123") log in
    it('(11) Login test: should not let user with invalid username (username: "jasonxuFake", password:"123456") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jasonxuFake",
                    "logPassword": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (12) Login Test: should not let user with invalid password (username: "jasonxuFake", password:"fake") log in
    it('(12) Login test: should not let user with invalid password (username: "jasonxu", password:"fake") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jasonxu",
                    "logPassword": "fake"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
});
