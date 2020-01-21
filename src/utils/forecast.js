const request = require('request')

const forecast = (latitude, longitude, callback) => {
    url = 'https://api.darksky.net/forecast/a56da225060c1c9c9f6b7a2392bba2c6/' + latitude + ',' + longitude + '?units=si'

    request({url, json:true}, (error, {body}) => {
        if (error){
            callback('Unable to connect to location services', undefined)
        } else if (body.error){
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out, with '+body.currently.humidity+'% of humidity. There is a ' + body.currently.precipProbability + '% chance of rain.')
        }
    })
}

module.exports = forecast