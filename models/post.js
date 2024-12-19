// models/post.js

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
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
    shares: {
      type: Array,
      default: [],
    },
    comentarios: [
      {
        userId: {
          type: String,
          required: true,
        },
        comentario: {
          type: String,
          required: true,
          max: 300,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    originalAuthor: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);