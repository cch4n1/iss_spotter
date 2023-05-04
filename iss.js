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

// fetches iss flyover times from JSON API
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, function(error, response, body) {
    if (error) {  // check for connection error
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const flyover = JSON.parse(body).response;
    return callback(null, flyover);  // return ip address to callback
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, gps) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(gps, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }
  
        callback(null, passTimes);
      });
    });
  });
}

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

module.exports = { nextISSTimesForMyLocation, printPassTimes };
