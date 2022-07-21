const jwt = require("jwt-simple")
const config = require("../config")
const CartProduct = require("../models/cartProduct")

const User = require("../models/user")
const validationHandler = require("../validations/validationHandler")
exports.login = async(req, res, next) => {
    try {
        validationHandler(req);

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error
        }
        const validPassword = await user.validPassword(password, user.password);

        if (!validPassword) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error
        }
        const token = jwt.encode({ id: user.id }, config.jwtSecret)
        return res.send({
            user: {
                "_id": user._id,
                "type": user.type,
                "cart": user.cart,
                "email": user.email,
                "name": user.name,
            },
            token
        })
    } catch (err) {
        next(err)
    }
}
exports.register = async(req, res, next) => {
    try {
        validationHandler(req);
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }

        let user = new User();
        user.email = req.body.email;
        user.password = await user.encryptPassword(req.body.password);
        user.name = req.body.name;
        user = await user.save();

        const token = jwt.encode({ id: user.id }, config.jwtSecret)
        delete user.password
        return res.send({
            user: {
                "_id": user._id,
                "type": user.type,
                "cart": user.cart,
                "email": user.email,
                "name": user.name,
            },
            token
        })
    } catch (err) {
        next(err)
    }
}
exports.index = async(req, res, next) => {
    try {
        if (!req.user || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 403;
            throw error;
        }
        const users = await User.find()

        res.send(users);
    } catch (err) {
        next(err);
    }

}
exports.me = async(req, res, next) => {
    try {
        const user = await User.findById(req.user)
        return res.send(user)
    } catch (err) {
        next(err)
    }
}
exports.delete = async(req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user || req.user.type != "admin") {
            const error = new Error("Wrong request")
            error.statusCode = 400;
            throw error;
        }
        await CartProduct.deleteMany({ _id: user.cart })
        await user.delete()
        res.send({ message: "success" });
    } catch (err) {
        next(err);
    }
};