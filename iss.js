/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request')

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org?format=json`, function (error, response, body) {
    // check for domain connection error
    if (error) {
      return callback(error, null)
    }
    // if non-200 status, assume server error
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    return callback(Error(msg), null);
  }
    const data = JSON.parse(body); 
    // check if no data returns
    if (data.length === 0) {
      return callback(`ip not found`, null)
    };
    // return ip
    const ip = data.ip
    return callback(null, ip)
  });
}

module.exports = { fetchMyIP };