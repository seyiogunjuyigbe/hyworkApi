"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TenantModels = require("../models/TenantModels");

var _crud = require("../../utils/crud");

exports["default"] = (0, _crud.crudControllers)(_TenantModels.Location);