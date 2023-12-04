// REGRINHA: Use função seta nos métodos da controller! () => {}

import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { TUserDB } from "../types"
import { BaseError } from "../errors/BaseError"
import { UpdateUserSchema } from "../dtos/users/updateUser.dto"
import { ZodError } from "zod"
import { SignupSchema } from "../dtos/users/signup.dto"
import { GetUsersInputDTO, GetUsersSchema } from "../dtos/users/getUsers.dto"
import { DeleteUserInputDTO, DeleteUserInputSchema } from "../dtos/users/deleteUser.dto"
import { LoginSchema } from "../dtos/users/login.dto"

export class UserController {
  constructor(
    private userBusiness: UserBusiness
  ) {}

  public getUsers = async (req: Request, res: Response) => {
    try {
      // const q = req.query.q as string | undefined

      const input: GetUsersInputDTO = GetUsersSchema.parse({
        nameToSearch: req.query.name as string | undefined,
        token: req.headers.authorization
      })

      // const userBusinness = new UserBusiness()
      const output = await this.userBusiness.getUsers(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public signup = async (req: Request, res: Response) => {
    try {

      const input = SignupSchema.parse({
        // id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      })

      // const userBusiness = new UserBusiness()
      const output = await this.userBusiness.signup(input)


      res.status(201).send({ output })
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password
      })

      const output = await this.userBusiness.login(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public updateUser = async (req: Request, res: Response) => {
    try {

      const input = UpdateUserSchema.parse({
        idToEdit: req.params.id,
        newId: req.body.id,
        newName: req.body.name,
        newEmail: req.body.email,
        newPassword: req.body.password,
        newRole: req.body.role
      })

      const output = await this.userBusiness.updateUser(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
    
  }

  public deleteUser = async (req: Request, res: Response) => {
    try {

      const input: DeleteUserInputDTO = DeleteUserInputSchema.parse({
        idToDelete: req.params.id
      })

      const response = await this.userBusiness.deleteUser(input)

      res.status(200).send({ message: 'User deletado com sucesso', response })
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
}