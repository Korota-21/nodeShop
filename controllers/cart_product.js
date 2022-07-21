const CartProduct = require("../models/cartProduct");
const { populate } = require("../models/product");
const validationHandler = require("../validations/validationHandler")
const User = require("../models/user");

exports.index = async(req, res, next) => {
    try {

        const user = await User.findById(req.user).populate("cart")
        const cart = user.cart
        res.send(cart);
    } catch (err) {
        next(err);
    }

}
exports.show = async(req, res, next) => {
    try {
        const cartProduct = await CartProduct.findOne({ _id: req.params.id });
        if (!req.user) {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        if (!cartProduct || !req.user.cart.includes(cartProduct._id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        res.send(cartProduct);
    } catch (err) {
        next(err);
    }

}
exports.store = async(req, res, next) => {
    try {
        validationHandler(req);
        let cartProduct = new CartProduct();
        cartProduct.product = req.body.product
        cartProduct.quantity = req.body.quantity;
        cartProduct.price = req.body.price;
        cartProduct = await cartProduct.save()
        req.user.cart.push(cartProduct._id)
        req.user.save()

        res.send(cartProduct);
    } catch (err) {
        next(err);
    }
};
exports.update = async(req, res, next) => {
    try {
        validationHandler(req);
        let cartProduct = await CartProduct.findById(req.params.id);
        if (!cartProduct || !req.user.cart.includes(cartProduct._id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }

        cartProduct.quantity = req.body.quantity;

        cartProduct = await cartProduct.save()
        res.send(cartProduct);
    } catch (err) {
        next(err);
    }
};
exports.delete = async(req, res, next) => {
    try {
        let cartProduct = await CartProduct.findById(req.params.id);
        if (!cartProduct || !req.user.cart.includes(cartProduct._id)) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        await cartProduct.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};