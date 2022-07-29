const express = require("express");
const wishProductController = require('../controllers/wish_product')
const uploadImage = require('../middlewares/multer')

const router = express.Router();

router.get("/", wishProductController.index);
router.post("/",
    wishProductController.store);

router.delete("/:id", wishProductController.delete);
module.exports = router;