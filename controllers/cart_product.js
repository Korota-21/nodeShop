const CartProduct = require("../models/cartProduct");
const validationHandler = require("../validations/validationHandler")
const User = require("../models/user");
const Product = require("../models/product");

exports.index = async(req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        const cart = await CartProduct.find({ user: req.user }).populate("product");
        res.send(cart);
    } catch (err) {
        next(err);
    }

}
exports.show = async(req, res, next) => {
    try {
        const cartProduct = await CartProduct.findOne({ _id: req.params.id });
        console.log(cartProduct);
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
        if (!req.user) {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        const product = await Product.findById(req.body.product);
        if (!product) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        const cartProd = await CartProduct.find({ user: req.user, product: product })
        if (cartProd[0]) {
            const error = new Error("Product already exists in cart")
            error.statusCode = 400;
            throw error;
        }
        let cartProduct = new CartProduct();
        cartProduct.product = req.body.product
        cartProduct.quantity = req.body.quantity;
        cartProduct.user = req.user;
        cartProduct = await cartProduct.save()

        res.send(cartProduct);
    } catch (err) {
        next(err);
    }
};
exports.update = async(req, res, next) => {
    try {
        validationHandler(req);
        let cartProd = await CartProduct.find({ _id: req.params.id, user: req.user });
        if (!cartProd[0]) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        let cartProduct = await CartProduct.findById(req.params.id);

        cartProduct.quantity = +req.body.quantity;

        cartProduct = await cartProduct.save()
        res.send(cartProduct);
    } catch (err) {
        next(err);
    }
};
exports.delete = async(req, res, next) => {
    try {
        let cartProduct = await CartProduct.find({ _id: req.params.id, user: req.user });
        if (!cartProduct[0]) {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        await cartProduct[0].delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};