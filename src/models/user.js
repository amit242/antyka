// get an instance of mongoose and mongoose.Schema
//var mongoose = require('mongoose');
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('user', new Schema({
    userid: String,
    email: String,
    name: String,
    password: String,
    jwt: String,
    address: String,
    neighbourhood: {type: Schema.Types.ObjectId, ref: 'neighbourhood'}
}), 'user');
