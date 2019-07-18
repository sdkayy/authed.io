"use strict";

// Libraries
const request = require("request");

function authed(information) {
    this.id = information.id || "";
    this.token = information.token || "";
    this.secret = information.secret || "";

    if (!this.id) {
        console.log("Invalid application id");
        process.exit(1);
    } else if (!this.token) {
        console.log("Invalid application token");
        process.exit(1);
    } else if (!this.secret) {
        console.log("Invalid application secret");
        process.exit(1);
    }
}

authed.prototype.authorize = function() {
    return new Promise((resolve, reject) => {
        request({
            json: true,
            method: "POST",
            url: "https://api.authed.io/app/verify/" + this.id,
            body: {
                "access": this.token
            }
        }, function(error, response, body) {
            if (error)
                callback("Failed to authorize application.");

            if (response.statusCode == 200 && body)
                resolve(body.session);
            else if (response.statusCode == 401)
                reject("Invalid access token.");
            else if (response.statusCode == 500)
                reject("An error has occured, please try again later or contact support.");
            else
                reject(body);
        });
    });
}

authed.prototype.login = function(email, password, callback) {
    if (!email) {
        console.log("Invalid email.");
        process.exit(1);
    } else if (!password) {
        console.log("Invalid password.");
        process.exit(1);
    } else {
        this.authorize().then(session => {
            request({
                json: true,
                method: "POST",
                url: "https://api.authed.io/app/login",
                headers: {
                    "session": session
                },
                body: {
                    "email": email,
                    "password": password
                }
            }, function(error, response, body) {
                if (error)
                    return callback(error);

                if (response.statusCode == 200)
                    callback(body);
                else if (response.statusCode == 500)
                    callback("An error has occured");
                else
                    callback(body);

            });
        }).catch(console.error);
    }
}

authed.prototype.register = function(email, password, code, callback) {
    if (!email) {
        console.log("Invalid email.");
        process.exit(1);
    } else if (!password) {
        console.log("Invalid password.");
        process.exit(1);
    } else {
        let license = null;

        if (code && code.length >= 1)
            license += code;

        this.authorize().then(session => {
            request({
                json: true,
                method: "POST",
                url: "https://api.authed.io/app/register",
                headers: {
                    "session": session
                },
                body: {
                    "email": email,
                    "password": password,
                    "licenseCode": code
                }
            }, function(error, response, body) {
                if (error)
                    return console.log(error);

                if (response.statusCode == 200) {
                    callback(body);
                } else if (response.statusCode == 500)
                    callback("[-] An error has occured");
            });
        }, function(error) {
            callback(error);
        });
    }
}

authed.prototype.generateLicence = function(prefix, level, time, amount, callback) {
    if (!prefix)
        prefix = null;
    else if (!level) {
        console.log("Invalid level.");
        process.exit(1);
    } else if (time < 0 && !time) {
        console.log("Invalid time.");
        process.exit(1);
    } else if (!amount) {
        console.log("Invalid amount.");
        process.exit(1);
    } else if (amount > 50) {
        console.log("Please enter an amount below 50.");
        process.exit(1);
    } else {
        this.authorize().then(session => {
            request({
                json: true,
                method: "POST",
                url: "https://api.authed.io/app/generate/license",
                headers: {
                    "session": session
                },
                body: {
                    "secret": this.secret,
                    "prefix": prefix,
                    "level": level,
                    "time": time,
                    "amount": amount
                }
            }, function(error, response, body) {
                if (error)
                    return console.log(error);

                if (response.statusCode == 200) {
                    callback(body);
                } else if (response.statusCode == 500)
                    callback("[-] An error has occured");
            });
        }, function(error) {
            callback(error);
        });
    }
}

module.exports = authed;
