# Authed.io API wrapper

    const client = require("authed.io");

## Set up API credentials
```js
const authed = new authed({
        id: "",
        token: "",
        secret: "",
});```

## Examples
    authed.login("authed@example.com", "example", function(response) {
        console.log(response);
    });

    authed.register("authed@example.com", "example", "license", function(response) {
        console.log(response);
    });
