"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Location = require("../models/Location");

var _crud = require("../utils/crud");

exports["default"] = (0, _crud.crudControllers)(_Location.Location);