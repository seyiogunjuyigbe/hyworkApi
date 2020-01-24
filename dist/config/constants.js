"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMAIN_NAME = exports.SECRET_KEY = exports.DB_URL = exports.PORT = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _process$env = process.env,
    PORT = _process$env.PORT,
    DB_URL = _process$env.DB_URL,
    SECRET_KEY = _process$env.SECRET_KEY,
    DOMAIN_NAME = _process$env.DOMAIN_NAME;
exports.DOMAIN_NAME = DOMAIN_NAME;
exports.SECRET_KEY = SECRET_KEY;
exports.DB_URL = DB_URL;
exports.PORT = PORT;