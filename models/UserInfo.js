const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoShema = new Schema({
    firstname: {
        type: String,
        required:true
    },
    lastname: {
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
    postal_code: {
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
    photo: {
        type: Object
    }
});

const UserInfo = mongoose.model('UserInfo',UserInfoShema);

module.exports = UserInfo;