import { Request, Response, NextFunction } from 'express';
import functionResponseError from '../../../components/responseError';
import UserModel from '../../../../../models/user';
import mongoose from 'mongoose';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const { userId } = req.params;
    // console.log(userId);

    const response = await UserModel.aggregate([
      {
        $match: {
          _id: new ObjectId(`${userId}`),
        },
      },

      {
        $lookup: {
          from: 'archives',
          localField: '_id',
          foreignField: 'user',
          as: 'items',
        },
      },
      {
        $limit: 1,
      },
    ]);
    // console.log(response[0]);
    if (response) {
      res.status(200).json(response[0]);
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default getUserById;
