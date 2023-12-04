import express from 'express'
import { UserController } from '../controller/UserController'
import { UserDatabase } from '../database/UserDatabase'
import { UserBusiness } from '../business/UserBusiness'
import { IdGenerator } from '../services/idGenerator'
import { TokenManager } from '../services/TokenManager'
import { HashManager } from '../services/HashManager'

export const userRouter = express.Router()

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
)

userRouter.get("/", userController.getUsers)
userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.put("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)
