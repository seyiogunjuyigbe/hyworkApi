const express = require('express');
const router = express.Router();
import { getAllLocations } from '../controllers/locationController';


// router.get('/:username', getUserByUsername);
router.get('/', getAllLocations);

export default router;