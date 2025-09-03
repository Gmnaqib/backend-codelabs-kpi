import User from '../models/user/user.schema';
import IUser from '../models/user/user.interface';

const userRepository = {
  findAll: () => User.find().select('-password'),
  findById: (id: string) => User.findById(id).select('-password'),
  createUser: (userData: IUser) => User.create(userData),
  findUser: (filter: Partial<IUser>) => User.findOne(filter),
  updateOne: (userData: any) => User.updateOne(userData),
};

export default userRepository;
