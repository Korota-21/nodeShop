const express = require("express");
const cartProductController = require('../controllers/cart_product')
const uploadImage = require('../middlewares/multer')

const router = express.Router();

router.get("/", cartProductController.index);
router.get("/:id", cartProductController.show);
router.post("/",
    cartProductController.store);

router.patch("/:id", cartProductController.update);
router.delete("/:id", cartProductController.delete);
module.exports = router;