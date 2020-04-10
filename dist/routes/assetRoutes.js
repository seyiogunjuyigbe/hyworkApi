"use strict";

var _middleware = require("../middlewares/middleware");

var _organization = require("../middlewares/organization");

var _asset = require("../controllers/asset");

var router = require('express').Router();

var validate = require('../middlewares/validate');

var _require = require('express-validator'),
    check = _require.check;

router.post('/:urlname/asset/new', [check('title').isString().not().isEmpty().withMessage('This asset needs a title'), check('description').isString().withMessage('Pleade enter a valid string as description'), check('acquiredBy').isString().not().isEmpty().withMessage('Please specify the recipient of this asset')], validate, _middleware.authUser, _asset.createAsset);
router.post('/:urlname/asset/:asset_id/update', [check('title').isString().not().isEmpty().withMessage('This asset needs a title'), check('description').isString().withMessage('Please enter a valid string as description'), check('acquiredBy').isString().not().isEmpty().withMessage('Please specify the recipient of this asset')], validate, _middleware.authUser, _asset.modifyAsset);
router.get("/:urlname/asset/:asset_id/delete", _middleware.authUser, _asset.deleteAsset);
module.exports = router;