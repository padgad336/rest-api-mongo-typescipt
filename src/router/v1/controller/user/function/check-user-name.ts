import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../../../../models';
import functionResponseError from '../../../components/responseError';

const checkUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const response = await UserModel.find({ username: { $in: username } });
    // console.log('response', response);
    if (response) {
      res.send(response);
      //    res.status(200).json({
      //      status: 200,
      //      code: 'SUCCESS_USER_FIND',
      //      message: 'Find User Success.',
      //    });
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};

export default checkUserName;
