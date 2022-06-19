const app = require('../server');
const request = require('supertest');
var token = [];
describe('twitter clone test', () => {
    // (1) Register test: Delete all current registered users
    it('(1) Register test: should delete all current regisered users', async () => {
        await request(app)
            .delete('/register/deleteall')
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (2) Register test: Register new user 1
    it('(2) Register test: should register new user 1 with username of "jason" and Email of "jasonxu@jasonxu.ca"', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jason",
                    "lastName": "Xu",
                    "username": "jason",
                    "email": "jasonxu@jasonxu.ca",
                    "password": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
        token.push(res.body.token)
    });
    // (3) Register test: Register new user 2
    it('(3) Register test: should register new user 2 with username of "john" and Email of "johnsmith@johnsmith.ca', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "John",
                    "lastName": "Smith",
                    "username": "john",
                    "email": "johnsmith@johnsmith.ca",
                    "password": "654321"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
        token.push(res.body.token)
    });
    // (4) Register test: Register new user 3
    it('(4) Register test: should register new user 3 with username of "jasonxu" and Email of "jackking@jacking.ca"', async () => {
        const res = await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jack",
                    "lastName": "King",
                    "username": "jack",
                    "email": "jackking@jackking.ca",
                    "password": "abcdef"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
        token.push(res.body.token)
    });

    // (5) Register test: Cannot resgister a user with same username
    it('(5) Register test: should not register a new user with same username like "jason"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Jason",
                    "lastName": "Xu",
                    "username": "jason",
                    "email": "jasonxutest@jasonxutest.com",
                    "password": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (6) Register test: Cannot resgister a user with same Email
    it('(6) Register test: should not register a new user with same Email like "jackking@jackking.ca"', async () => {
        await request(app)
            .post('/register')
            .send(
                {
                    "firstName": "Lucy",
                    "lastName": "Glover",
                    "username": "Lucy",
                    "email": "jackking@jackking.ca",
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

    // (8) Register test: should not register a new user with invalid email address 
    it('(8) Register test: should not register a new user with invalid email address like "abc"', async () => {
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

    // (9) Register test: should not register a new user with passwors less than 6 digits
    it('(9) Register test: should not register a new user with passwors less than 6 digits like "12345"', async () => {
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


    // (12) Login Test: should let user (username: "jason", password:"123456") log in
    it('(12) Login test: should let user (username: "jason", password:"123456") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jason",
                    "logPassword": "123456"
                }
            )
            .expect(200)
            .expect("Content-type", /json/)
    });
    // (13) Login Test: should not let user with invalid username (username: "jasonxuFake", password:"123") log in
    it('(13) Login test: should not let user with invalid username (username: "jasonFake", password:"123456") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jasonFake",
                    "logPassword": "123456"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    // (14) Login Test: should not let user with invalid password (username: "jasonxuFake", password:"fake") log in
    it('(14) Login test: should not let user with invalid password (username: "jason", password:"fakecode") log in', async () => {
        await request(app)
            .post('/login')
            .send(
                {
                    "logUsername": "jason",
                    "logPassword": "fakecode"
                }
            )
            .expect(400)
            .expect("Content-type", /json/)
    });
    console.log(token)
});
