import { LikeDislikeDB } from "../models/Post";
import { TPostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async findPosts(): Promise<TPostDB[]> {
        const postsDB: TPostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)

        return postsDB
    }

    public async findPostById(id: string): Promise<TPostDB | undefined> {
        const [ postDB ]: TPostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async insertPost(newPostDB: TPostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePost(idToEdit: string, newPost: TPostDB): Promise<void> {
      await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id: idToEdit })
        .update(newPost)
    }

    public async deletePost(idToDelete: string): Promise< void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({id: idToDelete})
        .delete()
    }

    public async findLikeOrDislike(
        userId: string,
        postId: string
        ): Promise<LikeDislikeDB | undefined> {
        const [result]: LikeDislikeDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
            user_id: userId,
            post_id: postId
        })
        
        return result
    }

    public async createLikeDislike (
        userId: string,
        postId: string,
        like: number
        ): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .insert({
            user_id: userId,
            post_id: postId,
            like
        })        
    }

    public async updateLikes (
        postId: string,
        likes: number
        ): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({likes})
        .where({id: postId})
    }

    public async updateDislike (
        postId: string,
        dislikes: number
        ): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({dislikes})
        .where({id: postId})
    }

    public async removeLikeDislike (
        postId: string,
        userId: string
        ): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            post_id: postId,
            user_id: userId
        })
    }

    public async updateLikeDislike (
        postId: string,
        userId: string,
        like: number
        ): Promise<void> {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .update({
            like
        })
        .where({
            post_id: postId,
            user_id: userId
        })
    }
}
