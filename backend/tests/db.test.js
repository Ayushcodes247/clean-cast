const mongoose = require('mongoose');
const connectDB = require('../configs/DB/db.config');
const dotenv = require('dotenv');

dotenv.config();

describe("Database Connection", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should connect to MongoDB successfully", async () => {
    const state = mongoose.connection.readyState;
    // 1 = connected, 2 = connecting
    expect([1, 2]).toContain(state);
  });
});