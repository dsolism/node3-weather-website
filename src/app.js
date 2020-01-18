const path = require('path') //Core module, no need to be installed
const express = require('express') //npm module, it has to be installed
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Configuramos Heroku; si la primera opción no existe (solo funciona en Heroku), tomará la segunda (3000)
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars, engine and views location

// default engine extension to use when omitted
app.set('view engine', 'hbs')

// Le indicamos express, que no vaya al directorio por defecto a buscar los archivos
// que sería 'views', sino que vaya a otro personalizado (en nuestro caso, 'templates')
app.set('views', viewsPath)

hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather',
        name: 'Adrew Mead'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        'title': 'About me',
        'name': 'Andrew Mead'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        'helpText':'This is some helpful text',
        'title': 'Help',
        'name': 'David Solís'
    })
})

app.get('/weather', (req, res)=>{

    if (!req.query.address){
        return res.send({
            "error": "You must provide an address"
        })
    }

    geocode(req.query.address, (error,{latitude, longitude, location} = {}) => {

        if (error){
            return res.send({
                error
            })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({
                error
            })}

            res.send({
                "forecast": forecastData,
                location,
                address: req.query.address

            })

          })
    })
})

app.get('/products', (req, res)=>{


    if(!req.query.search){
        return res.send({
            "error": 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        "products":[]
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404',{
        "title": "Error 404",
        "name": "David Solís",
        "errorMessage": "Help article not found"
    })
})

app.get('*', (req, res)=>{
    res.render('404',{
        "title": "Error 404",
        "name": "David Solís",
        "errorMessage": "Page not found"
    })
})

app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})