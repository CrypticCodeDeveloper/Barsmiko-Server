
const Blog = require("../models/blog")
const clearHtml = require("../utils/clearhtml")
const isLink = require("../utils/isValidLink")
const cloudinary = require("../libs/cloudinary")

const uploadToCloudinary = async (path) => {
  const result = await cloudinary.uploader.upload(path, {
      folder: "blog_uploads",
    });

    return result;
}

const getAllPosts = async (req, res) => {
    const blogs = await Blog.find({}).populate("author")
    res.status(200).json({
        data: {
            message: "All blog posts",
            blogs,
        }
    })
}

const getBlogPost = async (req, res) => {
   const { id } = req.params;

   try {
    const blog = await Blog.findOne({_id: id}).populate("author");

    if (!blog) {
    const err = new Error("Blog post does not exist.");
    err.statusCode = 404;
    throw err;
   }

   res.status(200).json({
    data: {
        message: "Blog post retrieved",
        blog,
    }
   })

   } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Unexpected error occured."
        })
   }
   
}

const createNewBlog = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, content, category } = req.body;
    const coverImageProperties = req.file;

    if (!title || !content || !category || !coverImageProperties) {
      return res.status(409).json({
        message: "Missing fields required."
      })
    }

    const result = await uploadToCloudinary(coverImageProperties.path);

    const blogPost = new Blog({
      title,
      content,
      author: user._id,
      category,
      cover_image: result.secure_url,
      cover_image_public_id: result.public_id,
      preview_text:
        content.length > 200
          ? clearHtml(content).slice(0, 200)
          : clearHtml(content),
    });

    await blogPost.save();

    return res.status(201).json({
      data: {
        message: "New blog post created",
        blog: blogPost,
      },
    });
  } catch (error) {
    if (error.name === "MongoError" && result?.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }

    return res.status(500).json({
        message: "Something went wrong!"
    })
  }
};

const deleteBlogPost = async (req, res) => {
    const {id} = req.params;
    const blog = await Blog.findOne({_id : id})
    console.log(blog)

    if (!blog) {
        return res.status(404).json({
            message: "Blog post does not exist"
        })
    }

    try {
        await cloudinary.uploader.destroy(blog.cover_image_public_id);
        await Blog.findOneAndDelete({_id: id})

        return res.status(200).json({
            data: {
                message: "Blog deleted successfully",
                blog,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Could not delete blog post",
            error,
        })
    }
}

const editBlogPost = async (req, res) => {
    const data = req.body;
    const {id} = req.params;
    const coverImageProperties = req.file;

    let result;
    const blogToUpdate = await Blog.findOne({_id: id})

    if (!isLink(data.cover_image)) {
      try {
        await cloudinary.uploader.destroy(blogToUpdate.cover_image_public_id);
        result = await uploadToCloudinary(coverImageProperties.path);
        data.cover_image = result.secure_url;
        data.cover_image_public_id = result.public_id;
      } catch (error) {
        return res.status(500).json({
          message: "Could not upload blog image, try again!",
          error,
        })
      }
    }

    try {
        const blogResult = await Blog.findOneAndUpdate(
        {_id: id},
        {...data},
        {new: true}
    )

    return res.status(200).json({
        message: "Updated blog successfully",
        blogResult,
    })
    } catch (error) {
        return res.status(500).json({
            message: "Could not update blog post"
        })
    }
}


module.exports = {
    createNewBlog,
    getAllPosts,
    getBlogPost,
    deleteBlogPost,
    editBlogPost
}