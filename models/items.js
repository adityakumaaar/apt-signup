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

const itemSchema = new mongoose.Schema({

    url: {
        type : String,
        required: true
    },

    price: {
        type : [Number]
    },

    subscription: {
        type : [ subSchema ]
        // type : [{
        //     email : String,
        //     name:  String,
        //     targetPrice : Number
        // }]
    }
    
})

module.exports = mongoose.model('Item',itemSchema)