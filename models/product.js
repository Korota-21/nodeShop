const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    tags: { type: [String], required: true },
    colors: { type: [String], required: true },
    availability: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('product', ProductSchema);