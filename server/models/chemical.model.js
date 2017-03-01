'use strict';

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chemicalSchema = new Schema({
    chemical: {type: String, required: true, unique: true},
    maxweight: {type: String, required: true},
    location: {type: String, required: true},
    store: {type: String, required: true}
});

// the schema is useless so far
// we need to create a model using it
// make this available to our Node applications
module.exports = mongoose.model('Chemical', chemicalSchema);