const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CartProductSchema = new Schema({

    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('cart_product', CartProductSchema);