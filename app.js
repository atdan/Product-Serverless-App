'use strict';

var MongoClient = require('mongodb').MongoClient;

let atlas_connection_uri;
let cachedDb = null;
const mongoURI = 'mongodb://Atuma:atumadann@basic-crud-u4tcz.mongodb.net/Products?retryWrites=true&w=majority';

exports.handler = (event, context, callback) => {
    var uri = mongoURI;

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback);
    }
    else {
        atlas_connection_uri = uri;
        console.log('the Atlas connection string is ' + atlas_connection_uri);
        processEvent(event, context, callback);
    }
};

function processEvent(event, context, callback) {
    console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
}
