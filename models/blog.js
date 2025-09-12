
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Blog title is required."]
    },
    content: {
        type: String,
        required: [true, "Blog content is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    cover_image: {
        type: String,
        required: [true, "Cover image is required"]
    },
    preview_text: {
        type: String,
        requried: true,
    },
    cover_image_public_id: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Blog', BlogSchema);