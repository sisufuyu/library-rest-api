import UserModel from '../models/User'
import { UserEntry, UserDocument } from '../type'
import { NotFoundError } from '../helpers/apiError'

const createUser = async (user: UserEntry): Promise<UserDocument> => {
  const newUser = new UserModel(user)
  return await newUser.save()
}

const findAllUsers = async (): Promise<UserDocument[]> => {
  return await UserModel.find({})
    .sort({ firstName: 1, lastName: 1 })
    .populate('borrowedBooks', ['title'])
}

const findUserById = async (userId: string): Promise<UserDocument | null> => {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw new NotFoundError(`User ${userId} not Found`)
  }

  return user
}

const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  const user = await UserModel.findOne({ email })

  if (!user) {
    return null
  }

  return user
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const user = await UserModel.findByIdAndDelete(userId)

  if (!user) {
    throw new NotFoundError(`User ${userId} not Found`)
  }

  return user
}

const updateUser = async (
  userId: string,
  update: Partial<UserEntry>
): Promise<UserDocument | null> => {
  const user = await UserModel.findByIdAndUpdate(userId, update, { new: true })

  if (!user) {
    throw new NotFoundError(`User ${userId} not Found`)
  }

  return user
}

export default {
  createUser,
  findAllUsers,
  findUserById,
  findUserByEmail,
  deleteUser,
  updateUser,
}
