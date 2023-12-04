import { UserDatabase } from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { DeleteUserInputDTO } from "../dtos/users/deleteUser.dto";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { UpdateUserInputDTO, UpdateUserOutputDTO } from "../dtos/users/updateUser.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES, User, UserModel } from "../models/User";
import { TUserDB } from "../types";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { HashManager } from "../services/HashManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }

  public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { nameToSearch, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido")
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("Acesso inválido, acesso somente por ADMINS")
    }

    const usersDB = await this.userDatabase.findUsers(nameToSearch)

    const users = usersDB.map(userDB => {
      const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role as USER_ROLES,
      userDB.created_at
    )

    const UserModel: UserModel = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
      createdAt: user.getCreatedAt()
    }
  
    return UserModel
  })

  const output: GetUsersOutputDTO = users

    return output
  }

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

    const { name, email, password } = input

    const id = this.idGenerator.generate()

    const hashedPassword = await this.hashManager.hash(password)

    const userDBExists = await this.userDatabase.findUserById(id)

    if (userDBExists) {
      throw new BadRequestError("'id' já existe")
    }

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.ADMIN,
      new Date().toISOString()
    )

    const newUserDB = newUser.toDBModel()
    await this.userDatabase.insertUser(newUserDB)

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: SignupOutputDTO = {
      message: "User registrado com sucesso",
      token
    }
    return output

  }

  public login = async (
    input: LoginInputDTO
  ): Promise<LoginOutputDTO> => {
    const { email, password } = input

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado")
    }

    const isPasswordCorrect = await this.hashManager.compare(password, userDB.password)

    if (!isPasswordCorrect) {
      throw new BadRequestError("'email' ou 'password' incorretos")
    }
    
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token
    }

    return output
  }

  public updateUser = async (input: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> => {

    const {
      idToEdit,
      newId,
      newName,
      newEmail,
      newPassword,
      newRole
    } = input

    // if (newId !== undefined) {
    //   if (typeof newId !== "string") {
    //     // res.status(400)
    //     throw new BadRequestError("'newId' deve ser string")
    //   }
    // }

    // if (newName !== undefined) {
    //   if (typeof newName !== "string") {
    //     // res.status(400)
    //     throw new BadRequestError("'newName' deve ser string")
    //   }
    // }

    // if (newEmail !== undefined) {
    //   if (typeof newEmail !== "string") {
    //     // res.status(400)
    //     throw new BadRequestError("'newEmail' deve ser string")
    //   }
    // }

    // if (newPassword !== undefined) {
    //   if (typeof newPassword !== "string") {
    //     // res.status(400)
    //     throw new BadRequestError("'newPassword' deve ser string")
    //   }
    // }

    // if (newRole !== undefined) {
    //   if (typeof newRole !== "string") {
    //     // res.status(400)
    //     throw new BadRequestError("'newRole' deve ser string")
    //   }
    // }

    // const userDatabase = new UserDatabase()
    const userDB = await this.userDatabase.findUserById(idToEdit)

    if (!userDB) {
      throw new NotFoundError("'id' não encontrado")
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role as USER_ROLES,
      userDB.created_at
    )

    newId && user.setId(newId)
    newName && user.setName(newName)
    newEmail && user.setEmail(newEmail)
    newPassword && user.setPassword(newPassword)
    newRole && user.setRole(newRole as USER_ROLES)

    const newUserDB: TUserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt()
    }

    await this.userDatabase.updateUser(idToEdit, newUserDB)

    const output: UpdateUserOutputDTO = {
      message: "Usuário atualizado",
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
        createdAt: user.getCreatedAt()
      }
    }
    return output

  }

  public deleteUser = async (input: DeleteUserInputDTO): Promise<User> => {
    const { idToDelete } = input

    if (idToDelete !== undefined) {
      if (typeof idToDelete !== "string") {
        throw new BadRequestError("'id' deve ser string")
      }
    }

    const userDB = await this.userDatabase.findUserById(idToDelete)

    if (!userDB) {
      throw new BadRequestError("'User' não encontrado")
    }

    await this.userDatabase.deleteUser(idToDelete)

    const user: User = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role as USER_ROLES,
      userDB.created_at
    );
    return user;
  }


}