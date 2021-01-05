const mongoose = require('mongoose')

const subSchema = new mongoose.Schema({
    email : {
        type: String
    },
    name: {
        type : String
    },
    targetPrice: {
        type: Number
    }
})


module.exports = mongoose.model('Sub',subSchema)