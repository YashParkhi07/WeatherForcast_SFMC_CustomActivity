const Postmonger = require('postmonger');
const axios = require('axios');

const connection = new Postmonger.Session();

const eventDefinitionKey = 'e1d21e03-185e-4ff0-9f05-cf5afef778c4'; // Replace with your actual event definition key

let payload = {};
let meta = {};

connection.on('initActivity', function (data) {
    if (data) {
        payload = data;
    }

    meta = Object.assign({}, payload.meta);

    connection.trigger('ready');
});

connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
    if (eventDefinitionModel) {
        eventDefinitionModel.success = true;
        eventDefinitionModel.eventDefinitionKey = eventDefinitionKey;

        connection.trigger('requestedTriggerEventDefinition', eventDefinitionModel);
    }
});

connection.on('requestedInteraction', function () {
    handleRequestedInteraction(connection.triggerEvent);
});

connection.on('clickedNext', function () {
    handleClickNext();
});

connection.on('requestedPublish', function () {
    handleRequestedPublish();
});

connection.on('requestedUnpublish', function () {
    handleRequestedUnpublish();
});

connection.on('requestedStop', function () {
    handleRequestedStop();
});

// Handle the 'init' event
connection.on('init', function (data) {
    connection.trigger('ready');
});

function handleRequestedInteraction(event) {
    // Here, you can access event.email and event.region
    // Retrieve other necessary data from event data
    const email = event.email;
    const region = event.region;

    // Fetch weather forecast
    getWeatherForecast(region)
        .then(weatherForecast => {
            // You can also perform additional data manipulation here

            // Send email or perform other actions
            sendEmail(email, region, weatherForecast);
        })
        .catch(error => {
            console.error('Error handling interaction:', error);
        });
}

function handleClickNext() {
    // Handle the 'clickedNext' event
    connection.trigger('nextStep');
}

function handleRequestedPublish() {
    // Handle the 'requestedPublish' event
    connection.trigger('ready');
}

function handleRequestedUnpublish() {
    // Handle the 'requestedUnpublish' event
    connection.trigger('ready');
}

function handleRequestedStop() {
    // Handle the 'requestedStop' event
    connection.trigger('stop');
}

function getWeatherForecast(region) {
    const apiKey = '93476b4a31d4b405bb1e255d39c455a0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${apiKey}&units=metric`;

    return axios.get(apiUrl)
        .then(response => {
            const weatherData = response.data;
            const weatherDescription = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;

            return `Weather forecast for ${region}: ${weatherDescription}, Temperature: ${temperature}°C`;
        })
        .catch(error => {
            console.error('Error fetching weather forecast:', error);
            return 'Weather forecast data not available';
        });
}

function sendEmail(email, region, weatherForecast) {
    // Replace with your email sending logic
    // For this example, we're logging the email details instead
    console.log(`Email sent to: ${email}`);
    console.log(`Subject: Weather Forecast for ${region}`);
    console.log(`Weather Forecast: ${weatherForecast}`);
}
