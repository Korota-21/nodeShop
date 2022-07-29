const validationHandler = require("../validations/validationHandler")
const User = require("../models/user");
const Product = require("../models/product");

exports.index = async(req, res, next) => {
    try {
        const user = await User.findById(req.user).populate("wishList")
        const wishList = user.wishList
        let count
        await Product.countDocuments(query).exec((err, _count) => {
            if (err) {
                res.send(err);
                return;
            }
            count = _count
        })
        res.send(wishList, count);
    } catch (err) {
        next(err);
    }

}

exports.store = async(req, res, next) => {
    try {
        validationHandler(req);
        let product = await Product.findById(req.body.product_id);
        if (!product || req.user.wishList.includes(product._id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        req.user.wishList.push(product)
        req.user.save()

        res.send(product);
    } catch (err) {
        next(err);
    }
};

exports.delete = async(req, res, next) => {
    try {
        // let product = await Product.findById(req.body.product_id);
        if (!req.user.wishList.includes(req.params.id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        for (var i = 0; i < req.user.wishList.length; i++) {
            if (req.user.wishList[i] == req.params.id) {
                var spliced = req.user.wishList.splice(i, 1);

            }
        }
        req.user.save()

        //  await cartProduct.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};