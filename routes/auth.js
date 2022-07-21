const express = require("express");
const passportJWT = require("../middlewares/passportJWT")()
const router = express.Router();


const authController = require('../controllers/auth')
const { isEmail, hasPassword, hasName } = require('../validations/validators')

router.post("/login", authController.login);
router.post("/register", [isEmail, hasPassword, hasName], authController.register);
router.get("/me", passportJWT.authenticate(), authController.me);
router.delete("/:id", passportJWT.authenticate(), authController.delete);

module.exports = router;