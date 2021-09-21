import express from "express"
import authorsRouter from "./services/authors/index.js"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import {
  notFoundHandler,
  badRequestHandler,
  forbiddenHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js";
import blogPostsRouter from "./services/blogPosts/index.js";
import { join } from "path";
// import filesRouter from "./services/files/index.js"

const server = express()
const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "public");

// cors options
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, next) => {
    console.log("Origin --> ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} is not allowed`));
    }
  },
}; // options to be passed in the cors() middle ware

//********** GLOBAL MIDDLEWARES *************
server.use(express.static(publicFolderPath)); //grants access to the public folder in the url
server.use(cors(corsOpts)) // for communicate FE with BE - IMPORTANT
server.use(express.json()) // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter or others)

// ************ ROUTES **********
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)
// server.use("/files", filesRouter)

// ************ ERROR HANDLING ************
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(genericServerErrorHandler);

console.table(listEndpoints(server)) // will show us the detailed endpoints in a table

server.listen(port, () => {
    console.log (`server running on port ${port}`)
})

// server.on("error", (error) => {
//     console.log(`server return : ${error}`)
// }