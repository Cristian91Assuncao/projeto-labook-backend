import { UserDB } from "../models/User";
import { TUserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(nameToSearch?: string): Promise<TUserDB[]> {
        let usersDB

        if (nameToSearch) {
            const result: TUserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${nameToSearch}%`)

            usersDB = result
        } else {
            const result: TUserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)

            usersDB = result
        }

        return usersDB
    }

    public async findUserById(id: string): Promise<TUserDB | undefined> {
        const [ userDB ]: TUserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id })

        return userDB
    }

    public async findUserByEmail(
      email: string
    ): Promise<UserDB | undefined> {
      const [userDB]: UserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ email })
  
      return userDB
    }

    public async insertUser(newUserDB: TUserDB): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    public async updateUser(idToEdit: string, newUserDB: TUserDB): Promise<void> {
      await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ id: idToEdit })
        .update(newUserDB)
    }

    public async deleteUser(idToDelete: string): Promise< void> {
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({id: idToDelete})
        .delete()
    }
    
}
