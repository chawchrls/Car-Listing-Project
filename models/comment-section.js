const mongoose = require('mongoose');

    const commentSchema = new mongoose.Schema({
        author:{
            type: String,
        },
        text: {
          type: String,
          trim: true,
          required: true
       },
        date: {
          type: Date,
          default: Date.now
       },
       // each comment can only relates to one blog, so it's not in array
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Details'
       }
     })

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;