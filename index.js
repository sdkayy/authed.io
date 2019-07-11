"use strict";

// Libraries
const authed = require("./lib/authed.js");
const prompt = require("prompts");

// Variables
var questions = [{
        type: "text",
        name: "email",
        message: "Email:"
    },
    {
        type: "text",
        name: "password",
        message: "Password:"
    }
];

async function login() {
    const output = await prompt(questions);

    if (!output.email && !output.password)
        return console.log("[-] Invalid email or password");

    authed.main(output.email, output.password);
}

login();