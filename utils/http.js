const axios = require("axios");

exports.client = axios.create({
  baseURL: "http://localhost:3001",
});
