// ************************* AUTHORS CRUD ***************************
// import {Router} from "express"
import express from "express"
import fs from "fs"
import {dirname, join} from "path"
import { fileURLToPath } from "url"
import uniqid  from "uniqid"
// import { request } from "http"

const authorsRouter = express.Router();


// road to obtain authorsJSONFilePath
//1
const currentFilePath = fileURLToPath(import.meta.url)
//2
const currentDirPath = dirname(currentFilePath)
//3
const authorsJSONFilePath = join(currentDirPath, "authors.json") // Here you have to change to find the right folder


//1

authorsRouter.post("/", (req, resp) =>{
    console.log("request body", req.body)
    // const {name, surname, email, dateOfBirth} = req.body
    const newAuthor = {
        ...req.body,
        id: uniqid(),
        // name,
        // surname,
        // email,
        // dateOfBirth,
        // avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
        createdAt: new Date(),
        updateAt: new Date()
    }

    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    authors.push(newAuthor)
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))

    // const fileContent = fs.readFileSync(authorsJSONFilePath)
    // const fileAsString = fileContent.toString()
    // const fileAsJASON = JSON.parse(fileAsString)
    // fileAsJASON.push(newAuthor)
    // fs.writeFileSync(authorsJSONFilePath.JSON.stringify)
    // console.log(newAuthor)
    resp.status(201).send({  id: newAuthor.id })
})

//2

authorsRouter.get("/", (req, resp) =>{

    const fileContent = fs.readFileSync(authorsJSONFilePath)
    const authors = JSON.parse(fileContent)

    resp.send(authors)
})

//3

authorsRouter.get("/:authorID", (req, resp) =>{
    console.log("author id:", req.params.authorID)
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    const author = authors.find(a => a.id === req.params.authorID)

    resp.send(author)
})

//4

authorsRouter.put("/:authorID", (req, resp) =>{
    // way 1
    // const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    // const remainingAuthors = authors.filter(a => a.id !== req.params.authorID)
    // const updatedAuthors =  {...req.body, id: req.params.authorID}
    // remainingAuthors.push(updatedAuthors)
    // fs.writeFileSync(authorsJSONFilePath, JSON.stringify(remainingAuthors))
    // resp.send(updatedAuthors)

    // way 2
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    const index = authors.findIndex(a => a.id === req.params.authorID)
    const authorToModify = authors[index]
    const updatedFields = req.body
    const updatedAuthors = { ...authorToModify, ...updatedFields }
    authors[index] = updatedAuthors
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))
    resp.send(updatedAuthors)

})

//5

authorsRouter.delete("/:authorID", (req, resp) =>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath))
    const remainingAuthors = authors.filter(a => a.id !== req.params.authorID)
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(remainingAuthors)) 

    resp.status(204).send("Hello im a delete resp")
})


export default authorsRouter