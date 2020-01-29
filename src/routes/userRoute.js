const express = require('express');
const router = express.Router();
import { getUserByUsername, getAllUsers } from '../controllers/userController';


router.get('/:username', getUserByUsername);
router.get('/', getAllUsers);

export default router;