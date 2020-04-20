const router = require('express').Router();
const validate = require('../middlewares/validate');
const { check } = require('express-validator');
import {authUser} from '../middlewares/middleware';
import {LoggedUserisEmployee, LoggedUserisAdmin} from '../middlewares/organization';
import {createAsset, modifyAsset, deleteAsset, fetchAssets} from '../controllers/asset'

router.post('/:urlname/asset/new', [
    check('title').isString().not().isEmpty().withMessage('This asset needs a title'),
    check('description').isString().withMessage('Pleade enter a valid string as description'),
    check('acquiredBy').isString().not().isEmpty().withMessage('Please specify the recipient of this asset'),
], validate, authUser, LoggedUserisAdmin, createAsset);
router.post('/:urlname/asset/:asset_id/update', [
    check('title').isString().not().isEmpty().withMessage('This asset needs a title'),
    check('description').isString().withMessage('Please enter a valid string as description'),
    check('acquiredBy').isString().not().isEmpty().withMessage('Please specify the recipient of this asset'),
], validate, authUser, modifyAsset)
router.get("/:urlname/asset/:asset_id/delete", authUser, LoggedUserisAdmin, deleteAsset)
router.get("/:urlname/asset/fetch", authUser, LoggedUserisAdmin, fetchAssets)

module.exports = router;