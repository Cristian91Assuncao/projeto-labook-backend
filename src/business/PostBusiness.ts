import { PostDatabase } from "../database/PostDatabase"
import { DeletePostInputDTO } from "../dtos/posts/deletePost.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto"
import { LikeOrDislikeInputDTO, LikeOrDislikeOutputDTO } from "../dtos/posts/likeOrDislike.dto"
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../dtos/posts/updatePost.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post, PostModel } from "../models/Post"
import { TPostDB } from "../types"

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase
  ) { }

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {

    const postsDB: TPostDB[] = await this.postDatabase.findPosts()

    const posts = postsDB.map(postDB => {
      const post = new Post(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at
      )

      const postModel: PostModel = {
        id: post.getId(),
        creatorId: post.getCreatorId(),
        content: post.getContent(),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt()
      }
      return postModel
    })

    const output: GetPostsOutputDTO = posts

    return output

  }

  public createPost = async (input: any) => {

    const { id, creator_id, content, likes, dislikes } = input

    if (typeof id !== "string") {
      // res.status(400)
      throw new BadRequestError("'id' deve ser string")
    }

    if (typeof creator_id !== "string") {
      // res.status(400)
      throw new BadRequestError("'creator_id' deve ser string")
    }

    if (typeof content !== "string") {
      // res.status(400)
      throw new BadRequestError("'content' deve ser string")
    }

    // const postDatabase = new PostDatabase()
    const postDBExists = await this.postDatabase.findPostById(id)

    if (postDBExists) {
      // res.status(400)
      throw new Error("'Post' já existe")
    }

    const newPost = new Post(
      id,
      creator_id,
      content,
      likes,
      dislikes,
      new Date().toDateString(),
      new Date().toDateString()
    )

    const newPostDB: TPostDB = {
      id: newPost.getId(),
      creator_id: newPost.getCreatorId(),
      content: newPost.getContent(),
      likes: newPost.getLikes(),
      dislikes: newPost.getDislikes(),
      created_at: newPost.getCreatedAt(),
      updated_at: newPost.getUpdatedAt()
    }

    // const [ postDB ]: TPostDB[] = await db("posts").where({ id })        
    await this.postDatabase.insertPost(newPostDB)


    // public createPost = async (input: CreatePostInputDTO
    //   ): Promise<CreatePostOutputDTO> => {

    //   const { id, creatorId, content, likes, dislikes } = input

    //   const postDBExists = await this.postDatabase.findPostById(id)

    //   if (postDBExists) {
    //     // res.status(400)
    //     throw new BadRequestError("'Post' já existe")
    //   }

    //   const newPost = new Post(
    //     id,
    //     creatorId,
    //     content,
    //     likes,
    //     dislikes,
    //     new Date().toDateString(),
    //     new Date().toDateString()
    //   )

    //   const newPostDB: TPostDB = {
    //     id: newPost.getId(),
    //     creator_id: newPost.getCreatorId(),
    //     content: newPost.getContent(),
    //     likes: newPost.getLikes(),
    //     dislikes: newPost.getDislikes(),
    //     created_at: newPost.getCreatedAt(),
    //     updated_at: newPost.getUpdatedAt()
    //   }

    //   // const [ postDB ]: TPostDB[] = await db("posts").where({ id })        
    //   await this.postDatabase.insertPost(newPostDB)

    //   const response: CreatePostOutputDTO = {
    //     message: "Post registrado com sucesso",
    //     posts: {
    //       id: newPost.getId(),
    //       creatorId: newPost.getCreatorId(),
    //       content: newPost.getContent(),
    //       likes: newPost.getLikes(),
    //       dislikes: newPost.getDislikes(),
    //       createdAt: newPost.getCreatedAt(),
    //       updatedAt: newPost.getUpdatedAt(),
    //     }
    //   };

    //   return response;
    // }



  }

  public updatePost = async (input: UpdatePostInputDTO): Promise<UpdatePostOutputDTO> => {

    const {
      idToEdit,
      newId,
      newCreatorId,
      newContent,
      newLikes,
      newDislikes
    } = input

    //   if (newId !== undefined) {
    //     if (typeof newId !== "string") {
    //         // res.status(400)
    //         throw new BadRequestError("'newId' deve ser string")
    //     }
    // }

    // if (newCreator_id !== undefined) {
    //     if (typeof newCreator_id !== "string") {
    //         // res.status(400)
    //         throw new BadRequestError("'newCreator_id' deve ser string")
    //     }
    // }

    // if (newContent !== undefined) {
    //     if (typeof newContent !== "string") {
    //         // res.status(400)
    //         throw new BadRequestError("'newContent' deve ser string")
    //     }
    // }

    // const [ PostDB ]: TPostDB[] | undefined[] = await db("accounts").where({ id })
    // const postDatabase = new PostDatabase()
    const postDB = await this.postDatabase.findPostById(idToEdit)

    if (!postDB) {
      throw new NotFoundError("'Post' não encontrado")
    }

    const post = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at

    )

    newId && post.setId(newId)
    newCreatorId && post.setCreatorId(newCreatorId)
    newContent && post.setContent(newContent)
    newLikes && post.setLikes(newLikes),
      newDislikes && post.setDislikes(newDislikes)

    const newPostDB: TPostDB = {
      id: post.getId(),
      creator_id: post.getCreatedAt(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt()
    }

    await this.postDatabase.updatePost(idToEdit, newPostDB)
    // await db("accounts").update({ balance: accountDB.balance }).where({ id })

    const output: UpdatePostOutputDTO = {
      message: "Post editado com sucesso",
      posts: {
        id: post.getId(),
        creatorId: post.getCreatorId(),
        content: post.getContent(),
        likes: post.getLikes(),
        dislikes: post.getDislikes(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
      },
    };

    return output;
  }

  public deletePost = async (input: DeletePostInputDTO): Promise<Post> => {
    const { idToDelete } = input

    if (idToDelete !== undefined) {
      if (typeof idToDelete !== "string") {
        throw new BadRequestError("'id' deve ser string")
      }
    }

    const postDB = await this.postDatabase.findPostById(idToDelete)

    if (!postDB) {
      throw new BadRequestError("'Post' não encontrado")
    }

    await this.postDatabase.deletePost(idToDelete)

    const post: Post = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at
    );

    return post;
  };

  public likeOrDislike = async (
    input: LikeOrDislikeInputDTO
  ): Promise<LikeOrDislikeOutputDTO> => {
    const { postId, like, token } = input

    const userId = token

    const postDB = await this.postDatabase.findPostById(postId)

    if (!postDB) {
      throw new NotFoundError("Post não encontrado")
    }

    const post = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at
    );

    const likeDislikeDB = await this.postDatabase.findLikeOrDislike(userId, post.getId())

    const likeSqlite = like ? 1 : 0

    if (!likeDislikeDB) {
      await this.postDatabase.createLikeDislike(
        userId,
        post.getId(),
        likeSqlite
      )

      if (like) {
        post.addLike()
        await this.postDatabase.updateLikes(postId, post.getLikes())

      } else {
        post.addDislike()
        await this.postDatabase.updateDislike(postId, post.getDislikes())
      }

    } else if (likeDislikeDB.like) {
      if (like) {
        await this.postDatabase.removeLikeDislike(postId, userId)

        post.removeLike()
        await this.postDatabase.updateLikes(postId, post.getLikes())

      } else {
        await this.postDatabase.updateLikeDislike(postId, userId, likeSqlite)
        post.removeLike()
        post.addDislike()

        await this.postDatabase.updateLikes(postId, post.getLikes())
        await this.postDatabase.updateDislike(postId, post.getDislikes())

      }

    } else {
      if (!like) {
        await this.postDatabase.removeLikeDislike(postId, userId)

        post.removeDislike()
        await this.postDatabase.updateDislike(postId, post.getDislikes())
      } else {
        await this.postDatabase.updateLikeDislike(postId, userId, likeSqlite)
        post.removeDislike()
        post.addLike()

        await this.postDatabase.updateLikes(postId, post.getLikes())
        await this.postDatabase.updateDislike(postId, post.getDislikes())
      }
    }

    return
  }
}