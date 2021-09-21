import express from "express"
import multer from "multer"

import { saveAvatar, saveCover } from "../../lib/tools.js"

const filesRouter = express.Router()

filesRouter.post("/uploadAvatar",multer().single("avatar"), async (req, res, next) => {
    try {
      await saveAvatar(req.file.originalname, req.file.buffer)
      res.send("OK")
    } catch (error) {
      next(error)
    }
  }
)

filesRouter.post("/uploadCover",multer().single("cover"), async (req, res, next) => {
    try {
      await saveCover(req.file.originalname, req.file.buffer)
      res.send("OK")
    } catch (error) {
      next(error)
    }
  }
)

export default filesRouter