const mongoose = require('mongoose');

const visitorsSchema = new mongoose.Schema({
    visitors: String,
    date: String
},{
    versionKey: false,
    collection: 'visitors'
});

module.exports = mongoose.model('Visitors', visitorsSchema);