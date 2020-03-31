"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _TenantModels = require("../models/TenantModels");

var _crud = require("../../utils/crud");

var _default = (0, _crud.crudControllers)(_TenantModels.Location);

exports["default"] = _default;