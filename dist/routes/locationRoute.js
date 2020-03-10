"use strict";

var _express = require("express");

var _location = _interopRequireDefault(require("../controllers/location"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _require = require("express-validator"),
    check = _require.check;

var validate = require("../middlewares/validate");

var router = (0, _express.Router)();
router.get("/", _location["default"].getMany);
router.post("/new", [check("streetAddress").not().isEmpty().withMessage("Enter street address"), check("city").not().isEmpty().withMessage("Enter City"), check("state").not().isEmpty().withMessage("Enter state"), check("country").not().isEmpty().withMessage("Enter country")], validate, _location["default"].createOne);
module.exports = router;