"use strict";
exports.__esModule = true;
require('dotenv').config(); // Recommended way of loading dotenv
var inversify_config_1 = require("../inversify.config");
var types_1 = require("./types");
var bot = inversify_config_1["default"].get(types_1.TYPES.Bot);
bot.listen().then(function () {
    console.log('Logged in!');
})["catch"](function (error) {
    console.log('Error logging in! ', error);
});
