const axios = require("axios");

exports.client = axios.create({
  // baseURL: "http://192.168.1.29:3001",
  baseURL: "http://localhost:3001",
});
