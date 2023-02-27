const mongoose = require('mongoose');

const black = mongoose.Schema({
    Member: [],
});

let blackk = mongoose.model('UserS',black);

module.exports = { blackk }