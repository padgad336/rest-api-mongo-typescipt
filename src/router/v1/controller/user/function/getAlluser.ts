import { Request, Response, NextFunction } from 'express';
import functionResponseError from '../../../components/responseError';
import UserModel from '../../../../../models/user';

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await UserModel.find();
    // console.log(response);
    if (response) {
      res.status(200).json(response);
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default getAllUser;
