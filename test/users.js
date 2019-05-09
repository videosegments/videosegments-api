const request = require("request");
const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const config = require("../config.json");

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);

describe("/POST users", function () {
	it("user exists", function (done) {
		chai.request(server).post("/v4/register").set("content-type", "application/json").send({
			login: config.test.user.login
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("user exists");
			done();
		});
	});

	it("valid login password", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.user.login,
			password: config.test.user.password
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			done();
		});
	});

	it("invalid login/password", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.user.login,
			password: "qwerty2"
		}).end(function (err, res) {
			expect(res).to.have.status(401);
			done();
		});
	});

	it("registered", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.user.login,
			password: config.test.user.password
		}).end(function (err, res) {
			chai.request(server).post("/v4/register").set('cookie', res.headers["set-cookie"][0]).send({
				login: config.test.user.login,
				password: config.test.user.password
			}).end(function (err, res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("err");
				expect(res.body.err).to.be.equal("user registered");
				done();
			});
		});
	});

	it("registration", function (done) {
		let login = Math.random().toString(36).substring(7),
			password = Math.random().toString(36).substring(7);

		chai.request(server).post("/v4/register").send({
			login,
			password
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("success");
			expect(res.body.success).to.be.equal(true);
			done();
		});
	});
});