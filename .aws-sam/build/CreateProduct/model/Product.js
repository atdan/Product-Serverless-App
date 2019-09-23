const mongoose = require(`mongoose`);
const validator = require(`validator`);

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 1

    },
    price: {
        type: Number,
        required: true,

    },
    description: {
        type: String
    },
    sku: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    }
});
var Product = mongoose.Model(`Product`, ProductSchema);

module.exports = {
    Product
};
