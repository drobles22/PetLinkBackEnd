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
        require: true,
        min: 3,
        max: 20,
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
        max: 50,
      },
      city: {
        type: String,
        max: 50,
      },
      country: {
        type: String,
        max: 50,
      },
      itsBan:{
        type:Boolean,
        default:false
      },
      relationship: {
        type: Number,
        enum: [1, 2, 3],
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("User", UserSchema);