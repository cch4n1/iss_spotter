const request = require('request');

// fetches ip address from JSON API
const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, function(error, response, body) {
    // check for domain connection error
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const data = JSON.parse(body);
    // check if no data returns
    if (data.length === 0) {
      return callback(`ip not found`, null);
    }
    // return ip address to callback
    const ip = data.ip;
    return callback(null, ip);
  });
};

// fetches geo coordinates from JSON API based on ip address
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, function(error, response, body) {
    if (error) {
      return callback(error);
    }
    // saves data to gps object and returns to callback
    const data = JSON.parse(body);
    // error handling for invalid ip value
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      return callback(Error(message), null);
    }
    const gps = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    return callback(null, gps);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };
