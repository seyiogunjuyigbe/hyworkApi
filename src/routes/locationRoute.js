import { Router } from "express";
import controllers from "../controllers/locationController";
const { check } = require("express-validator");
const validate = require("../middlewares/validate");

const router = Router();

router.get("/", controllers.getMany);
router.post(
  "/",
  [
    check("streetAddress")
      .not()
      .isEmpty()
      .withMessage("Enter street address"),
    check("city")
      .not()
      .isEmpty()
      .withMessage("Enter City"),
    check("state")
      .not()
      .isEmpty()
      .withMessage("Enter state"),
    check("country")
      .not()
      .isEmpty()
      .withMessage("Enter country")
  ],
  validate,
  controllers.createOne
);

module.exports = router;
