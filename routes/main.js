// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('./login') // redirect to the login page
    } else {
        next (); // move to the next middleware function
    }
}
// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/weather', function(req, res, next){
    let city = req.query.city;
    
    if (!city) {
        return res.render('weather.ejs', { weather: null, error: null });
    }
    let apiKey = process.env.WEATHER_API_KEY; 
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    request(url, function (err, response, body) {
        if(err){
            next(err);
        } else {
            let weather = JSON.parse(body);

            if(weather.main == undefined){
                res.render('weather.ejs', { weather: null, error: 'Error: No weather data found for that city.'});
            } else {
                res.render('weather.ejs', { weather: weather, error: null});
            }
        }
    });
});

router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('/')
        }
        res.render('logout.ejs');
        })
    })

module.exports = router