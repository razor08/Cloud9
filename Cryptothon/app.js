var express = require("express"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
var app = express();