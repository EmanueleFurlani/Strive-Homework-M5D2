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

const server = express()
const port = 3001


//********** GLOBAL MIDDLEWARES *************
server.use(cors()) // for communicate FE with BE - IMPORTANT
server.use(express.json()) // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter or others)

// ************ ROUTES **********
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)

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