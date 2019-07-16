const inputParams = process.argv.slice(2);
const request = require('request');

flightSearch = (inputParams) => {
  const flightArr = [];
  const origin = (inputParams[0]);
  const destination = (inputParams[1]);
  const travelDate = (inputParams[2]);
  const numPassengers = (inputParams[3]);
  
  request(`https://desktopapps.ryanair.com/v4/en-gb/availability?ADT=${numPassengers}&CHD=0&DateOut=${travelDate}&Destination=${destination}&FlexDaysOut=2&INF=0&IncludeConnectingFlights=true&Origin=${origin}&RoundTrip=false&TEEN=0&ToUs=AGREED&exists=false`, function (error, response, body) {
    
    let data =  JSON.parse(body);

    if(error || response.statusCode !== 200) {
      console.log(`Error details: ${data.message} Error code: ${response.statusCode}`)
    } else if(!data.trips[0].dates[0].flights[0]) {
      console.log('No flights found')
    } else {
      populateObj(data);
      
      flightArr.sort(function(a, b) {
        return a.fare - b.fare
      })

      flightArr.forEach(el => {
        console.log(`${el.flightNumber} ${el.flightOrigin} ==> ${el.flightDestination} (${el.departure} ${el.arrival}) ${el.fare} ${el.currency}`)
      })
      
    }
  });

  let populateObj = (data) => {
    data.trips[0].dates[0].flights.forEach(el =>{
      flightArr.push({
        flightNumber: el.flightNumber,
        flightOrigin: data.trips[0].origin,
        flightDestination: data.trips[0].destination,
        fare: (el.regularFare.fares[0].amount * numPassengers).toFixed(2),
        currency: data.currency,
        departure: el.time[0],
        arrival: el.time[1]
      })
    })
  }
}

flightSearch(inputParams);





