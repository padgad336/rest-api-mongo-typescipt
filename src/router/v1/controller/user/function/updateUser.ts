import { Request, Response, NextFunction } from 'express';
import functionResponseError from '../../../components/responseError';
import UserModel from '../../../../../models/user';

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { id, username, firstname, password, lastname, email, mobile } = req.body;
    const userData = {
      id,
      username,
      password,
      firstname,
      lastname,
      email,
      mobile,
    };
    const response = await UserModel.findByIdAndUpdate({ _id: userId }, userData);
    // console.log(response);
    if (response) {
      res.status(200).json({
        status: 200,
        code: 'SUCCESS_USER_UPDATE',
        message: 'Updated User Success.',
      });
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default updateUserById;
