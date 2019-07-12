# Authed.io API wrapper

const client = require("authed.io");

## Set up API credentials
const authed = new authed({
    id: "",
    token: "",
    secret: "",
});

authed.login("authed@example.com", "example", function(response) {
    console.log(response);
});

// set license to null if app in free mode 
authed.register("authed@example.com", "example", "license", function(response) {
    console.log(response);
});
