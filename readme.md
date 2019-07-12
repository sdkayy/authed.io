# Authed.io API wrapper

## Discord
[discord](https://discord.gg/sxVvkMS)

```js
const client = require("authed.io");
```

## Set up API credentials
```js
const authed = new authed({
        id: "",
        token: "",
        secret: "",
});
```

## Examples
```js
authed.login("authed@example.com", "example", function(response) {
        console.log(response);
});
```

```js
authed.register("authed@example.com", "example", "license", function(response) {
        console.log(response);
});
```
