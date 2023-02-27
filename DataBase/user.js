const mongoose = require('mongoose');

const data = mongoose.Schema({
    Member: String,
});

let user = mongoose.model('User',data);

module.exports = { user }