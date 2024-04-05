const axios = require("axios");

exports.client = axios.create({
  baseURL: "http://192.168.1.38:3001/",
});
