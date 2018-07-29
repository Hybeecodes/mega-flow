const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');

const UserSchema = new Schema({
    firstname: {
        type: String,
        required:true
    },
    lastname: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:false
    },
    city:{
        type: String,
        required:false
    },
    country:{
        type: String,
        required:false
    },
    zipcode: {
        type: String,
        required:false
    },
    facebook:{
        type: String,
        required:false
    },
    twitter:{
        type: String,
        required:false
    },
    instagram:{
        type: String,
        required:false
    },
    about:{
        type: String,
        required:false
    },
    blogname:{
        type: String,
        required:false
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    photo: {
        type: Object
    }
});
const User = mongoose.model('User',UserSchema);

module.exports = User;