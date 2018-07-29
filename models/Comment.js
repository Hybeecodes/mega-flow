const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

const CommentSchema = new Schema({
    commenter_name:{
        type:String,
        required:true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    comment_date:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;