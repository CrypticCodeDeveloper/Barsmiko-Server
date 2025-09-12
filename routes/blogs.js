const express = require("express");
const router = express.Router();

const upload = require("../libs/multer");
const {
  createNewBlog,
  getAllPosts,
  getBlogPost,
  deleteBlogPost,
  editBlogPost,
} = require("../controllers/blog");

const verifyJwt = require("../middlewares/verifyjwt");

router.post("/", verifyJwt, upload.single("cover_image"), createNewBlog);
router.get("/", getAllPosts);
router.get("/:id", getBlogPost);
router.delete("/:id", verifyJwt, deleteBlogPost);
router.put("/:id", upload.single("cover_image"), verifyJwt, editBlogPost);

module.exports = router;
