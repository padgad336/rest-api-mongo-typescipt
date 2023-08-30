import { Request, Response, NextFunction } from 'express';
import functionResponseError from '../../../components/responseError';
import UserModel from '../../../../../models/user';
import passwordHash from 'password-hash';

const updatePasswordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { username, password, newPassword } = req.body;

    const foundUser = await UserModel.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    const match = passwordHash.verify(password, `${foundUser?.password}`);

    if (match) {
      const hashedPassword = passwordHash.generate(newPassword);
      const passwordData = {
        password: hashedPassword,
      };
      const response = await UserModel.findByIdAndUpdate({ _id: userId }, passwordData);
      console.log(response);
      if (response) {
        res.status(200).json({
          status: 200,
          code: 'SUCCESS_PASSWORD_UPDATE',
          message: 'Updated Password Success.',
          check: true
        });
      }
    }
    if (!match) {
      res.send({ check: false });
    }
  } catch (e) {
    functionResponseError(e, res);
  }
};
export default updatePasswordById;
