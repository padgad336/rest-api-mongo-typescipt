import { Request, Response, NextFunction } from 'express';
import functionResponseError from '../../../components/responseError';
import UserModel from '../../../../../models/user';

const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const response = await UserModel.findByIdAndRemove({ _id: userId });
    console.log(response);
    if (response) {
      res.status(200).json({
        status: 200,
        code: 'SUCCESS_USER_REMOVE',
        message: 'Removed User Success.',
      });
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default deleteUserById;
