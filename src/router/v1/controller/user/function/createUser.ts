
import { Request,Response,NextFunction } from "express"
import { UserModel } from "../../../../../models"
import functionResponseError from '../../../components/responseError'
import passwordHash from 'password-hash'

 
 const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, username, password, firstname, lastname, email, mobile } = req.body;
    const hashedPassword = passwordHash.generate(password);
    const userData = {
      username,
      password: hashedPassword,
      firstname,
      lastname,
      role,
      email,
      mobile,
    };
    const response = await UserModel.create(userData);
    console.log(response);
    if (response) {
      res.status(200).json({
        status: 200,
        code: 'SUCCESS_USER_CREATE',
        message: 'Created User Success.',
      });
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default createUser;