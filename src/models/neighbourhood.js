// get an instance of mongoose and mongoose.Schema
//var mongoose = require('mongoose');
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('neighbourhood', new Schema({
    encodedpolygon: String,
    neighbourhoodCenter: {
      lat: Number,
      lng: Number
    },
    verified: Boolean,
    neighbourCount: Number,
    createdby: {type: Schema.Types.ObjectId, ref: 'user'},
    adjoiningNeighbourhoods: [{
      _id: { type: Schema.Types.ObjectId, ref: 'neighbourhood' }
    }]
}), 'neighbourhood');
