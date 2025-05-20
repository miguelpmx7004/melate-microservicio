import { USER_DEFAULT } from "../constants/constants";
import { IUserService } from "../models/models";

export class UserService implements IUserService  {
  getCurrentUser(): string {
    return USER_DEFAULT; // Usuario por defecto o usuario actual.
  }
}
