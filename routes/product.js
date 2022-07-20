const express = require("express");
const productController = require('../controllers/product')
const uploadImage = require('../middlewares/multer')
const passportJWT = require("../middlewares/passportJWT")()

const router = express.Router();

router.get("/", productController.index);
router.get("/:id", productController.show);
router.post("/", passportJWT.authenticate(),
    uploadImage('product').single('image'),
    productController.store);

router.patch("/:id", passportJWT.authenticate(), productController.update);
router.delete("/:id", passportJWT.authenticate(), productController.delete);
module.exports = router;