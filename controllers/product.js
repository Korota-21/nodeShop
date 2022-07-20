const Product = require("../models/product")
const validationHandler = require("../validations/validationHandler")

exports.index = async(req, res) => {
    try {
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 50;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const products = await Product.find().skip((page - 1) * pagination).limit(pagination).sort({ createdAt: -1 });
        res.send(products);
    } catch (err) {
        next(err);
    }

}
exports.show = async(req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        res.send(product);
    } catch (err) {
        next(err);
    }

}
exports.store = async(req, res, next) => {
    try {
        validationHandler(req);
        let product = new Product();
        product.image = req.file.filename;
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.tags = req.body.tags;
        product.colors = req.body.colors;
        product.availability = req.body.availability;
        product = await product.save()
        res.send(product);
    } catch (err) {
        next(err);
    }
};
exports.update = async(req, res, next) => {
    try {
        validationHandler(req);
        let product = await Product.findById(req.params.id);
        if (!req.user || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        if (!product || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.tags = req.body.tags;
        product.colors = req.body.colors;
        product.availability = req.body.availability;
        product.description = req.body.description;
        product = await product.save()
        res.send(product);
    } catch (err) {
        next(err);
    }
};
exports.delete = async(req, res, next) => {
    try {

        let product = await Product.findById(req.params.id);
        if (!req.user || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        if (!product || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        await product.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};