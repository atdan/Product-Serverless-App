'use strict';

var Product = require(`./model/Product`);


var {ObjectID} = require('mongodb');
const  mongoose = require(`mongoose`);

const mongoURL =  'mongodb+srv://Atuma:atumadann@basic-crud-u4tcz.mongodb.net/Products?retryWrites=true&w=majority';
// const mongoURL = process.env.MONGO_DB_URL;
const mongoOptions = {useNewUrlParser: true,
    useUnifiedTopology :true};

mongoose.connect(mongoURL, mongoOptions, err => {
    if (err){
        console.error(`Error connecting to database: `, err);

        return;
    }
    console.log('Connected to Database!')
});
const errRes = (statusCode, message) => ({
    statusCode: statusCode || 501,

    body: message || 'Incorrect id',
});

function successMessage (product){

}
module.exports.CreateProduct = async (event,context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    let data;
    let product;
    data = JSON.parse(event.body);

    console.log("Data: ", data);


    product = new Product({
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        sku: data.sku,
        status: data.status
    });

    console.log(`Product: `, product);


    try {
        await product.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Successfully saved to Database!",
                value: product
            }),


        }
    }catch (e) {
        console.log(`Error: `, e);
        return {
            statusCode: e.statusCode,
            message: e.message
        }
    }


};

module.exports.ReadAllProducts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    let product;
    try {
         product = await Product.find({});

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "All documents in the database",
                value: product
            }),


        }

    }catch (e) {
        console.log('Error: ', e);
        errRes(e.statusCode, e.message)
    }
};

module.exports.readProduct = async (event, context) => {

    const _id = event.pathParameters._id;
    console.log("id: ",_id);

    let product;

    if (!ObjectID.isValid(_id)){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid id: ${_id}`
            })

        }
    }

    try {
        product = await Product.find({_id: _id})
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Gotten document with _id: ${_id}`,
                data: product
            })
        }
    }catch (e) {
        return {
            statusCode: e.statusCode,
            body: {
                error: true,
                message: e.message
            }
        }
    }

};

module.exports.deleteProduct = async (event, context) => {
    const _id = event.pathParameters._id;
    let product;

    if (!ObjectID.isValid(_id)){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid id: ${_id}`
            })

        }
    }


    try {
        product = await Product.remove({_id: _id})
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Deleted document with _id: ${_id}`,
                data: product
            })
        }
    }catch (e) {
        return {
            statusCode: e.statusCode,
            body: {
                error: true,
                message: e.message
            }
        }
    }
};

module.exports.updateProduct = async (event, context) => {
    const data = JSON.parse(event.body);
    const _id = event.pathParameters._id;
    let product;

    if (!ObjectID.isValid(_id)){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Invalid id: ${_id}`
            })

        }

    }


    try {
        product = await Product.findByIdAndUpdate(_id, data, {new: true});
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Updated document with _id: ${_id}`,
                data: product
            })
        }
    }catch (e) {
        return {
            statusCode: e.statusCode,
            body: {
                error: true,
                message: e.message
            }
        }
    }




};



