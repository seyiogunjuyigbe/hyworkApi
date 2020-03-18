"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;

var _auth = require("../controllers/auth");

var _password = require("../controllers/password");

var authRouter = require('./authRoutes');

var userRouter = require('./userRoute.js');

var locationRouter = require('./locationRoute.js');

var organizationRouter = require('./organizationRoute');

var fileRouter = require('./fileRoute');

var attendanceRouter = require('./attendanceRoutes.js');

var shiftRouter = require('./shiftRoutes.js');

var departmentRouter = require('./departmentRouter');

var leaveRouter = require('./leaveRoutes');

var caseRouter = require('./caseRoutes');

var taskRouter = require('./taskRoutes');

var assetRouter = require('./assetRoutes');

var travelRouter = require('./travelRoutes');

var initRoutes = function initRoutes(app) {
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  app.use('/auth', authRouter);
  app.use('/org/:urlname/u', userRouter);
  app.use('/org', attendanceRouter);
  app.use('/org', shiftRouter);
  app.use('/location', locationRouter);
  app.use('/org', organizationRouter);
  app.use('/org', fileRouter);
  app.use('/org', departmentRouter);
  app.use('/org', leaveRouter);
  app.use('/org', taskRouter);
  app.use('/org', caseRouter);
  app.use('/org', assetRouter);
  app.use('/org', travelRouter);
};

exports.initRoutes = initRoutes;