// import express from "express";
// import uniqid from "uniqid";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import createHttpError from "http-errors";
// import { validationResult } from "express-validator";
// import { blogPostValidation } from "./validation.js";

const blogPostsRouter = express.Router(); // provide Routing

// ********* BLOGPOST ROUTES ***********

const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)),"blogPosts.json");


const readBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = (content) => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content))


//1
blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPosts = readBlogPosts();
    console.log(blogPosts);

    if (req.query && req.query.title) {
      const filteredBlogPosts = blogPosts.filter((post) =>
        post.title === req.query.title
      );
      res.status(201).send(filteredBlogPosts);
    } else {
      res.send(blogPosts);
    }
  } catch (error) {
    next(error)
  }
});

//2
blogPostsRouter.get("/:_id", (req, res, next) => {
  try {
    const blogPosts = readBlogPosts();
    const blogPost = blogPosts.find((p) => p._id === req.params._id);

    if (blogPost) {
      res.status(201).send(blogPost);
    } else {
      next(
        createHttpError(
          404, 
          `Blog post with the id: ${req.params._id} not found.`
          )
      );
    }
  } catch (error) {
    next(error)
  }
});

//3
blogPostsRouter.post("/", blogPostValidation, (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (errorList.isEmpty()) {
      const blogPosts = readBlogPosts();
      const newBlogPost = {
        ...req.body,
        _id: uniqid(),
        createdAt: new Date(),
        readTime: { value: 1, unit: "minute" },
      };
     blogPosts.push(newBlogPost);
     writeBlogPosts(blogPosts);
     res.status(201).send(newBlogPost);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    next(error)
  }
});


//4
blogPostsRouter.put("/:_id", blogPostValidation, (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (errorList.isEmpty()) {
      const blogPosts = readBlogPosts();
      const blogPostToUpdate = blogPosts.find((p) => p._id === req.params._id);
      const updatedBlogPost = { ...blogPostToUpdate, ...req.body };
      const remainingBlogPosts = blogPosts.filter((p) => p._id !== req.params._id);
      remainingBlogPosts.push(updatedBlogPost);
      writeBlogPosts(remainingBlogPosts);
      res.send(updatedBlogPost);
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    next(error)
  }
});


//5
blogPostsRouter.delete("/:_id", (req, res, next) => {
  try {
    const blogPosts = readBlogPosts();
    const blogPost = blogPosts.find((p) => p._id === req.params._id);

    if (blogPost) {
      const remainingBlogPosts = blogPosts.filter((p) => p._id !== req.params._id);
      writeBlogPosts(remainingBlogPosts);
      res.send({
        message: `The Blog post with the id: ${blogPost._id} was deleted`,
        blogPost: blogPost,
      });
    } else {
      next(
        createHttpError(
          404,
          `The blog post with the id: ${req.params._id} was not found`
        )
      );
    }
  } catch (error) {
    next(error)
  }
});

// export default blogPostsRouter;
