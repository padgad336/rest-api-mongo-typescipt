import { Router, Request, Response } from 'express'

import * as auth from './auth/auth';

import * as  validUser from './controller/user/validate';
import * as validLogin from './controller/login/validate';
import * as login from './controller/login/controller';
import * as logout from './controller/logout/controller';
import * as accessToken from './controller/accestoken/controller';
import * as me from './controller/me/controller';
import * as user from './controller/user/controller'

// http://localhost:4000/api/v1/message
const routerV1 = Router()
routerV1.get('/', (req: Request, res: Response) => {
  res.send('🚀 Welcome Ropa Version 1 🚀');
});
routerV1.route('/updatePassword/:userId')
  .put(auth.check, user.updatePasswordById);
routerV1.route('/checkusername/:username')
  .get(user.checkUserName);
routerV1.route('/userinfo/:userId')
  .get(user.getUserById)
routerV1.route('/updateUser/:userId')
  .put(auth.check, user.updateUserById)
routerV1.route('/getalluser')
  .get(user.getAllUser)
routerV1.route('/userremove/:userId')
  .delete(auth.check, user.deleteUserById)
routerV1.route('/user')
  .post(validUser.validationUser, user.createUser)
  .get(user.getAllUser)
routerV1.route('/login')
  .post(validLogin.validationLogin, login.createLogin)
routerV1.route('/logout')
  .get(auth.check, logout.handleLogout)
routerV1.route('/me')
  .get(auth.check, me.getMe)
routerV1.route('/accesstoken')
  .get(accessToken.handleAccessToken)


export default routerV1
