const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Comment = require('./Comment');

PostSchema = new Schema({
    title:{
        type:String,
        required:true,
        maxlength: 100
    },
    detail:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    created_at:{
        type:Date,
        required:true,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;