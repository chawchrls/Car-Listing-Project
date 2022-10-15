const mongoose = require('mongoose');

const carListSchema = new mongoose.Schema({
    FileName:{
        type: String,
    },
    UploadBy:{
        type: String,
    },
    ListName:{
        type: String,
        required: true,
    },
    Address:{
        type: String,
        default: "Location Not Set"
    },
    Description:{
        type: String,
        maxLength: 500
    },
    Type:{
        type: String,
    },
    Brand:{
        type: String,
    },
    Color:{
        type: String,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    Comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    
})

const Details = mongoose.model('Details', carListSchema);

module.exports = Details;