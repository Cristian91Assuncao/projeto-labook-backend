import { Request, Response } from "express"
import { PostDatabase } from "../database/PostDatabase"
import { Post } from "../models/Post"
import { TPostDB } from "../types"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"
import { ZodError } from "zod"
import { UpdatePostSchema } from "../dtos/posts/updatePost.dto"
import { DeletePostInputDTO, DeletePostInputSchema } from "../dtos/posts/deletePost.dto"
import { GetPostsSchema } from "../dtos/posts/getPosts.dto"
import { LikeOrDislikeSchema } from "../dtos/posts/likeOrDislike.dto"

export class PostController {
  constructor(
    private postBusiness: PostBusiness
  ) { }

  public getPosts = async (req: Request, res: Response) => {
    try {

      const input = GetPostsSchema.parse({
      })

      const output = await this.postBusiness.getPosts(input)

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

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.body.id,
        creator_id: req.body.creator_id,
        content: req.body.content,
        likes: req.body.likes,
        dislikes: req.body.dislikes
      }

      // const input = CreatePostSchema.parse({
      //   id: req.body.id,
      //   creator_id: req.body.creator_id,
      //   content: req.body.content,
      //   likes: req.body.likes,
      //   dislikes: req.body.dislikes
      // })

      const response = await this.postBusiness.createPost(input)

      res.status(201).send({ message: 'Post criado com sucesso', response })
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

  public updatePost = async (req: Request, res: Response) => {
    try {

      const input = UpdatePostSchema.parse({
        idToEdit: req.params.id,
        newId: req.body.id,
        newCreator_id: req.body.creator_id,
        newContent: req.body.content,
        newLikes: req.body.likes,
        newDislikes: req.body.dislikes
      })

      const output = await this.postBusiness.updatePost(input)

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

  public deletePost = async (req: Request, res: Response) => {
    try {

      const input: DeletePostInputDTO = DeletePostInputSchema.parse({
        idToDelete: req.params.id
      })

      const response = await this.postBusiness.deletePost(input)

      res.status(200).send({ message: 'Post deletado com sucesso', response })
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

  public likeOrDislike = async (req: Request, res: Response) => {
    try {

      const input = LikeOrDislikeSchema.parse({
        postId: req.params.id,
        like: req.body.like,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.likeOrDislike(input)

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

}