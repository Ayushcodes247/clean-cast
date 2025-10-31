// tests/server.test.js
const http = require("http");
const request = require("supertest");
const app = require("../app");

describe("Server Tests", () => {
  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, done); // use random available port
  });

  afterAll((done) => {
    server.close(done);
  });

  test("should respond with 200 on root route", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Clean Cast API Running");
  });

  test("should return 404 for unknown route", async () => {
    const res = await request(server).get("/random-url");
    expect(res.statusCode).toBe(404);
  });
});
