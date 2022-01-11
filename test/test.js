const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const request = require("supertest");
const { expect } = Code;
const { suite, test, describe, it, before, after, beforeEach, afterEach } =
  (exports.lab = Lab.script());
const server = require("../index");
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const uri = `http://${host}:${port}`;
suite("Application Api Tests", () => {
  before((done) => {
    server.start((err) => {
      if (err) throw err;
      done();
    });
  });
  test(`Dummy API`, async () => {
    const res = await request(uri).get("/");
    expect(res.statusCode).to.equal(404);
    expect(res.body.message).to.equal(`404 Error! Route not found`);
  });
  test(`Fetch Routes :- /getall`, async () => {
    const res = await request(uri).get(`/getall`);
    expect(res.statusCode).to.number();
    if (res.statusCode === 200) {
      expect(res.body).instanceOf(Array);
      expect(res.body.length).to.greaterThan(0);
    } else if (res.statusCode === 404) {
      expect(res.body).to.contain({ success: false });
      expect(res.body).to.contain({ message: `Table is empty` });
    } else {
      throw new Error(`No Valid Output from API`);
    }
  });
  test(`Fetch Routes :- /get`, async () => {
    const res = await request(uri).get(`/get`).query({ key: `testKey` });
    expect(res.statusCode).to.number();
    if (res.statusCode === 200) {
      expect(res.body.key).to.equal(`testKey`);
      expect(res.body.value).string();
    } else if (res.statusCode === 404) {
      expect(res.body).to.contain({ success: false });
      expect(res.body).to.contain({
        message: `Key doesnot exists in database`,
      });
    } else {
      throw new Error(`No Valid Output from API`);
    }
  });
  test(`Save Route :- /save`, async () => {
    const res = await request(uri)
      .post(`/save`)
      .send({ key: `testSaveKey`, value: `testSaveValue` });
    expect(res.statusCode).to.number();
    if (res.statusCode === 200) {
      expect(res.body).contain({ success: true });
      expect(res.body).contain({ message: `Data Successfully Saved` });
    } else if (res.statusCode === 500) {
      expect(res.body).contain({
        success: false,
        message: `Data could not be stored successfully`,
      });
    } else {
      throw new Error(`No Valid Output from API`);
    }
  });
  test(`Update Route :- /update`, async () => {
    const res = await request(uri)
      .put(`/update`)
      .send({ key: `testUpdateKey`, value: `testUpdateValue` });
    expect(res.statusCode).to.number();
    if (res.statusCode === 200) {
      expect(res.body).contain({
        success: true,
        message: `Data updated successfully`,
      });
    } else if (res.statusCode === 404) {
      expect({ success: false, message: `Key testUpdateKey doesnot exists` });
    } else {
      throw new Error(`No Valid Output from API`);
    }
  });
  test(`Delete Rpute :- /delete`, async () => {
    const res = await request(uri)
      .delete("/delete")
      .send({ key: `testDeleteKey` });
    expect(res.statusCode).to.number();
    if (res.statusCode === 200) {
      expect(res.body).contain({
        success: true,
        message: `Data with key testDeleteKey deleted from database`,
      });
    } else if (res.statusCode === 404) {
      expect(res.body).contain({
        success: false,
        message: `Data with key testDeleteKey doesnot exists`,
      });
    } else {
      throw new Error(`No Valid Output from API`);
    }
  });
  after(async () => {
    await server.stop();
    console.log(`Stopped Server`);
  });
});
