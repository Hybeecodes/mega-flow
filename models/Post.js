const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Comment = require('./Comment');
const mongoosePaginate = require('mongoose-paginate');


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
    image:{
        type:String,
        required:false
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    views:{
        type:Number,
        required:true,
        default:0
    },
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
PostSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;