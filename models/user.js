const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
      },
      name: {
        type: String,
        require: true,
        min: 3,
        max: 20,
      },
      lastName: {
        type: String,
        min: 3,
        max: 20,
        default:""
      },
      email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 6,
      },
      profilePicture: {
        type: String,
        default: "",
      },
      followers: {
        type: Array,
        default: [],
      },
      followings: {
        type: Array,
        default: [],
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      descr: {
        type: String,
        default:"",
        max: 50,
      },
      city: {
        type: String,
        max: 50,
        default:""
      },
      country: {
        type: String,
        max: 50,
        default:""
      },
      itsBan:{
        type:Boolean,
        default:false
      },
      itsPrivate:{
        type:Boolean,
        default:false
      },
      resetToken: {
        type: String, 
        default: "",
      },
      relationship: {
        type: Number,
        enum: [1, 2, 3],
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("User", UserSchema);