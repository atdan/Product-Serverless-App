'use strict';

var Product = require(`./model/Product`);


// var conf = require(`./utils/confDB`);

var {ObjectID} = require('mongodb');
const  mongoose = require(`mongoose`);
const MongoClient = require('mongodb');


// const mongoURL = 'mongodb://localhost:27017/Products';
// const mongoURL = 'mongodb://0.0.0.0:27017/Products';
const mongoURL =  'mongodb+srv://Atuma:atumadann@basic-crud-u4tcz.mongodb.net/Products?retryWrites=true&w=majority';
const mongoOptions = {useNewUrlParser: true,
    useUnifiedTopology :true,
    connectTimeoutMS: 10000};

// const client = new MongoClient(mongoURL, mongoOptions);


const errRes = (statusCode, message) => ({
    statusCode: statusCode || 501,

    body: message || 'Incorrect id',
});
const successRes = (statusCode, body) =>
{
    return {
        statusCode: statusCode,

        body: JSON.stringify(body)
    };
};

function connectReadAll(db, event, context, callback) {
    db.once('open', () => {
        Product
            .find({})
            .then((product) => {
                callback(null, successRes(200, product))
            }, (err) => {
                console.log("Error: ", err)
            })
            .catch((err) => {
                callback(null, errRes(err.statusCode, err.message));
            })
            .finally(() => {
                db.close();
            })
    })
}
function connectCreate(db, product){
    db.once(`open`, () => {
        product
            .save()
            .then((res) => {
                callback(null, successRes(200, res))
            }).catch((err) => {
            callback(null, errRes(err.statusCode, err.message));
        })
            .finally(() => {
                db.close();
            })
    })
}
module.exports.createProduct = (event,  context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    let db = {};
    let data = {};
    let product = {};

    db = mongoose.connect(mongoURL, mongoOptions).connection;
    data = JSON.parse(event.body);

    console.log("Data: ", data);

    // db = client.connect(err => {
    //     const collection = client.db("Products").collection("Products");
    //
    //
    // })
    product = new Product({
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        sku: data.sku,
        status: data.status
    });

    if(db){
        connectCreate( db, product );
    }

};

module.exports.ReadAllProducts = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    var db = mongoose.connect(mongoURL, mongoOptions).connection;

    if (db){
        connectReadAll(db, event, context, callback)
    }
};

module.exports.readProduct = (event, context, callback) => {

    const db = mongoose.connect(mongoURL).connection;
    const _id = event.params._id;

    if (!ObjectID.isValid(_id)){
        callback(null, errRes(400, 'Invalid id'));
        db.close();
        return;
    }

    db.once('open', () => {
        Product
            .find({_id: _id})
            .then((product) => {
                callback(null, successRes(200, product))
            })
            .catch((err) => {
                callback(null, errRes(err.statusCode, err.message))
            })
            .finally(() => {
                db.close();
            })
    })
};

module.exports.deleteProduct = (event, context, callback) => {
    const db = mongoose.connect(mongoURL).connection;
    const _id = event.params._id;

    if (!ObjectID.isValid(_id)){
        callback(null, errRes(400, 'Incorrect id'));
        db.close();
        return;
    }

    if (db){
        db.once('open', () => {
            Product
                .remove({_id: _id})
                .then(() => {
                    callback(null, successRes(200, `Product deleted: ${event.body}`))
                })
                .catch((err) => {
                    callback(null, errRes(err.statusCode, err.message));
                })
                .finally(() => {
                    db.close();
                });
        });
    }else{
        console.log('DB connection: error');
    }

};

module.exports.updateProduct = (event, context, callback) => {
    const db = mongoose.connect(mongoURL).connection;
    const data = JSON.parse(event.body);
    const _id = event.params._id;
    let product = {};

    if (!ObjectID.isValid(_id)){
        callback(null, errRes(400, 'Incorrect id'));
        db.close();
        return;
    }

    product = new Product({
        _id: _id,
        name: data.name,
        price: data.price,
        description: data.description,
        sku: data.sku,
        status: data.status
    });

    db.once('open', () => {
        Product
            .findByIdAndUpdate(_id, product)
            .then(() => {
                callback(null, successRes(200, `Product Updated: ${event.body}`))
            })
            .catch((err) => {
                callback(err, errRes(err.statusCode, err.message));
            })
            .finally(( ) => {
                db.close();
            })
    })


};



module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };




};
