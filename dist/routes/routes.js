"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;

var initRoutes = function initRoutes(app) {
  app.get('/', function (req, res) {
    res.send('HEllo World!');
  });
};

exports.initRoutes = initRoutes;