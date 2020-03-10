"use strict";

module.exports = {
  success: function success(res, status, data) {
    return res.status(status).json({
      status: status,
      data: data
    });
  },
  error: function error(res, status, message) {
    return res.status(status).json({
      status: status,
      message: message
    });
  }
};