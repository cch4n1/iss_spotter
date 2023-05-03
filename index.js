// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log('Error:', error);
    return;
  }
  fetchCoordsByIP(ip, (error, gps) => {
    if (error) {
      return console.log("It didn't work!" , error);
    }
    console.log('It worked! Returned coordinates:' , gps);
  });
});
