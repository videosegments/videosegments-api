const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const config = require("../config.json");

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);

describe("/GET segmentation", function () {
	it("segmentation exists", function (done) {
		chai.request(server).get("/v4/youtube/" + config.test.video.existing).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("timestamps");
			done();
		});
	});

	it("segmentation does not exists", function (done) {
		chai.request(server).get("/v4/youtube/9Jmr0tTP9_E").end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.not.have.property("timestamps");
			done();
		});
	});

	it("invalid domain", function (done) {
		chai.request(server).get("/v4/videosegments/9Jmr0tTP9_E").end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("domain is not supported");
			done();
		});
	});

	it("invalid video id", function (done) {
		chai.request(server).get("/v4/youtube/9Jmr0tTP9_E2").end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid video id");
			done();
		});
	});
});

describe("/POST segmentation", function () {
	it("segmentation added to pending as anonymous", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.anonymous).send({
			types: "c,a,c",
			timestamps: "10.0,20.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("added");
			expect(res.body.added).to.be.equal("pending");
			done();
		});
	});

	it("segmentation added to pending as user", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.user.login,
			password: config.test.user.password
		}).end(function (err, res) {
			chai.request(server).post("/v4/youtube/" + config.test.video.user).set('cookie', res.headers["set-cookie"][0]).send({
				types: "c,a,c",
				timestamps: "10.0,20.0"
			}).end(function (err, res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("added");
				expect(res.body.added).to.be.equal("pending");
				done();
			});
		});
	});

	it("segmentation added to database as moderator", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.moderator.login,
			password: config.test.moderator.password
		}).end(function (err, res) {
			chai.request(server).post("/v4/youtube/" + config.test.video.moderator).set('cookie', res.headers["set-cookie"][0]).send({
				types: "c,a,c",
				timestamps: "10.0,20.0"
			}).end(function (err, res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("added");
				expect(res.body.added).to.be.equal("database");
				done();
			});
		});
	});

	it("segmentation added to database as admin", function (done) {
		chai.request(server).post("/v4/login").set("content-type", "application/json").send({
			username: config.test.admin.login,
			password: config.test.admin.password
		}).end(function (err, res) {
			chai.request(server).post("/v4/youtube/" + config.test.video.admin).set('cookie', res.headers["set-cookie"][0]).send({
				types: "c,a,c",
				timestamps: "10.0,20.0"
			}).end(function (err, res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("added");
				expect(res.body.added).to.be.equal("database");
				done();
			});
		});
	});

	it("segmentation exists", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.existing).send({
			types: "c,a,c",
			timestamps: "10.0,20.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("segmentation exists");
			done();
		});
	});

	it("no types", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			timestamps: "10.0,20.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("no type(s) or timestamp(s) field(s)");
			done();
		});
	});

	it("no timestamps", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,a,c"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("no type(s) or timestamp(s) field(s)");
			done();
		});
	});

	it("invalid types", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,af,c",
			timestamps: "10.0,20.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid types");
			done();
		});
	});

	it("duplicate types", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,c,a",
			timestamps: "10.0,20.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid types");
			done();
		});
	});

	it("invalid timestamps", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,a,c",
			timestamps: "20.0,10.0"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid timestamps");
			done();
		});
	});

	it("timestamps more than types", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,a,c",
			timestamps: "10.0,20.0,30.5"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid types or timestamps length");
			done();
		});
	});

	it("types more than timestamps", function (done) {
		chai.request(server).post("/v4/youtube/" + config.test.video.invalid).send({
			types: "c,a,c,ac,c",
			timestamps: "10.0,20.0,30.5"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("err");
			expect(res.body.err).to.be.equal("invalid types or timestamps length");
			done();
		});
	});

	it("captcha", function (done) {
		chai.request(server).post("/v4/youtube/" + "00000000011").send({
			types: "c,a,c,ac,c",
			timestamps: "10.0,20.0,30.5,31"
		}).end(function (err, res) {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property("captcha");
			expect(res.body.captcha).to.be.equal(true);
			done();
		});
	});
});