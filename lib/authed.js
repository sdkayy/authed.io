"use strict";

// Libraries
const request = require("request");
const prompt = require("prompts");

// Includes
var sessionID = "";
var userSession = "";

// Variables
const authed = {
    "id": "80cb466f-0fc3-402c-94c8-29382a16b1a4",
    "token": "a2378943-8e7f-4d7a-a746-dd35d929f323",
    "secret": "1637d570-b077-4b68-976b-e5fb0786762b"
}

async function authorize() {
    return new Promise(async function(resolve, reject) {
        request({
            json: true,
            method: "POST",
            url: `https://api.authed.io/app/verify/${authed.id}`,
            body: {
                "access": authed.token
            }
        }, function(error, response, body) {
            if (error)
                return console.log(error);

            if (response.statusCode == 200 && body) {
                console.log("\n" + "[+] Successfully authed");

                resolve(body.session);
            } else if (response.statusCode == 401) {
                console.log("[-] Invalid access token");

                return reject();
            } else if (response.statusCode == 500) {
                console.log("[-] An error has occured");

                return reject();
            }
        });
    });
}

async function login(email, password, callback) {
    request({
        json: true,
        method: "POST",
        url: "https://api.authed.io/app/login",
        headers: {
            "session": sessionID
        },
        body: {
            "email": email,
            "password": password
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200 && body.userSession) {
            console.log("[+] Successfully logged in" + "\n");

            callback(body.userSession);
        } else if (response.statusCode == 200 && body && body.code == 400) {
            return console.log("[-] Incorrect email or password");
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        } else {
            if (body)
                console.log(body);

            console.log(response.statusCode);
        }
    });
}

async function register() {
    let code = null;

    let questions = [{
            type: "text",
            name: "email",
            message: "Email:"
        },
        {
            type: "text",
            name: "password",
            message: "Password:"
        },
        {
            type: "text",
            name: "license",
            message: "License: (leave empty if you dont have one)"
        }
    ];

    var output = await prompt(questions);

    if (!output.email && output.password)
        return console.log("[-] Invalid email or password");

    if (output.license)
        code += license;

    request({
        json: true,
        method: "POST",
        url: "https://api.authed.io/app/register",
        headers: {
            "session": sessionID
        },
        body: {
            "email": output.email,
            "password": output.password,
            "licenseCode": code
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200) {
            console.log("[+] Successfully registered account");
            console.log(body);
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        }
    });
}

async function renew(account) {
    var output = await prompt({
        type: "number",
        name: "function",
        message: "License:"
    });

    if (!output.license && output.license.length >= 1)
        return console.log("[-] Invalid license");

    request({
        json: true,
        method: "POST",
        url: "api.authed.io/app/renew",
        headers: {
            "session": sessionID
        },
        body: {
            "userSession": account,
            "licenseCode": output.license
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200) {
            console.log("[+] Successfully renewed license");
            console.log(body);
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        } else {
            if (body)
                console.log(body);

            console.log(response.statusCode);
        }
    });
}

async function client_update(account, field, value) {
    request({
        json: true,
        method: "POST",
        url: "https://api.authed.io/app/users/set",
        headers: {
            "session": sessionID
        },
        body: {
            "userSession": account,
            "field": field,
            "value": value
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200) {
            console.log(`[+] Successfully updated ${value}`);
            console.log(body);
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        } else {
            if (body)
                console.log(body);

            console.log(response.statusCode);
        }
    });
}

async function app_update(field, value) {
    request({
        json: true,
        method: "POST",
        url: "https://api.authed.io/app/set",
        headers: {
            "session": sessionID
        },
        body: {
            "secret": authed.secret,
            "field": field,
            "value": value
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200) {
            console.log(`[+] Successfully updated ${value}`);
            console.log(body);
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        } else {
            if (body)
                console.log(body);

            console.log(response.statusCode);
        }
    });
}

async function generate_license(prefix, time, amount) {
    let questions = [{
            type: "text",
            name: "prefix",
            message: "Prefix:"
        }
        {
            type: "text",
            name: "time",
            message: "Time: (formatted in days)"
        },
        {
            type: "number",
            name: "amount",
            message: "Amount of licenses:"
        }
    ];

    var output = await prompt(questions);

    if (!output.prefix && output.time && output.amount)
        return console.log("[-] Missing parameters");

    request({
        json: true,
        method: "POST",
        url: "https://api.authed.io/app/generate/license",
        headers: {
            "session": sessionID
        },
        body: {
            "secret": authed.secret,
            "prefix": output.prefix,
            "level": 1,
            "time": output.time,
            "count": output.amount
        }
    }, function(error, response, body) {
        if (error)
            return console.log(error);

        if (response.statusCode == 200) {
            console.log(`[+] Successfully generated ${output.amount} licenses`);
            console.log(body);
        } else if (response.statusCode == 500) {
            return console.log("[-] An error has occured");
        } else {
            if (body)
                console.log(body);

            console.log(response.statusCode);
        }
    });
}

async function main(email, password) {
    authorize().then(async function(session) {
        sessionID += session;

        login(email, password, async function(output) {
            userSession += output;

            console.log([
                "[1] Register account",
                "[2] Renew account license",
                "[3] Generate licenses",
                "[4] User updates?",
                "[5] Admin update?"
            ].join("\n") + "\n");

            var output = await prompt({
                type: "number",
                name: "function",
                message: "Function:"
            });

            if (!output.function && output.function != 1 && output.function != 2 && output.function != 3 && output.function != 4 && output.function != 5)
                return console.log("[-] Invalid function");

            if (output.function == 1)
                return register();
            else if (output.function == 2)
                return renew(userSession);
            else if (output.function == 3)
                return generate_license("loldongs", 1, 1440, 10);
            else if (output.function == 4)
                return client_update();
            else if (output.function == 5)
                return app_update();
        });

        //login("removal@riseup.net", "password123");
    });
}

module.exports.main = main;