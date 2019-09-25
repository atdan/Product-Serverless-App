const mongoose = require(`mongoose`);
const validator = require(`validator`);
const mongoosastic = require(`mongoosastic`);

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

ProductSchema.plugin(mongoosastic, {
    host: "<ES-hostname-here>",
    port: "<ES-port-here>Number",
    protocol: "https",
    auth: "<ES-auth-details-here>"
});
const Product = mongoose.model(`Products`, ProductSchema, `Products`);

module.exports = Product;
