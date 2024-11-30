const mongoose = require("mongoose")


const PostSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
      },
      postdesc: {
        type: String,
        max: 500,
      },
      attachment: {
        type: String,
      },
      likes: {
        type: Array,
        default: [],
      },
      shares:{
        type:Array,
        default:[]
      }
    },
    { timestamps: true }

  );
  
  module.exports = mongoose.model("Post", PostSchema);