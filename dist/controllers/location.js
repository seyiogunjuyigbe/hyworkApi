"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Location = require("../models/Location");

var _crud = require("../../utils/crud");

var _default = (0, _crud.crudControllers)(_Location.Location);

exports["default"] = _default;