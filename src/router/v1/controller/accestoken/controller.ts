
import { Request,Response,NextFunction } from "express"
import { UserModel } from "../../../../models"
import functionResponseError from '../../components/responseError'
import passwordHash from 'password-hash'
import { jwtSign } from "../../../../../config/util"
import config from 'config'

import jwt from 'jsonwebtoken'
 
export  const handleAccessToken =async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const cookies = req.cookies;
      if (!cookies?.refresh) return res.status(401).json({
        status: 401,
        code: 'Unauthorized',
        message: 'Unauthorized',
      });
      const refreshToken = cookies.refresh;
      // res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
      const foundUser = await UserModel.findOne({ refreshToken }).exec();
      // console.log('foundUser',foundUser);
      
      // Detected refresh token reuse!
      if (!foundUser) {
        // console.log('in foundUser');
          jwt.verify(
              refreshToken,
              config.get('jwt.secret'),
              async (err:any, decoded:any) => {
                  if (err) return res.status(403).json({
                    status: 403,
                    code: 'Forbidden',
                    message: 'Forbidden',
                  }) //Forbidden
                  console.log('attempted refresh token reuse!')
                  const hackedUser = await UserModel.findOne({ username: decoded.username }).exec();
                  if(hackedUser){
                    hackedUser.refreshToken = [];
                    const result = await hackedUser.save();
                    console.log(result);
                  }
              }
          )
          return res.status(403).json({
            status: 403,
            code: 'Forbidden',
            message: 'Forbidden',
          }) //Forbidden
      }
      const newRefreshTokenArray = foundUser.refreshToken.filter((rt:any )=> rt !== refreshToken);
      // evaluate jwt 
      jwt.verify(
          refreshToken,
          config.get('jwt.secret'),
          async (err:any, decoded:any) => {
              if (err) {
                  console.log('expired refresh token')
                  foundUser.refreshToken = [...newRefreshTokenArray];
                  const result = await foundUser.save();
                  console.log(result);
              }
              // console.log('in verify',err, foundUser?._id.toString() ,decoded.id);
              
              if (err || foundUser?._id.toString() !== decoded.id) return res.status(403).json({
                status: 403,
                code: 'Forbidden',
                message: 'Forbidden',
              }) 
  
              // Refresh token was still valid
              const roles = foundUser.role
              const accessToken = await jwtSign(
                {
                  id: foundUser?._id,
                  role: foundUser?.role,
                },
                "1m"
              );
              // const newRefreshToken  = await jwtSign(
              //   {
              //     id: foundUser?._id,
              //     role: foundUser?.role,
              //   },
              //   "1d"
              // );
              // // Saving refreshToken with current user
              // foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
              // const result = await foundUser.save();
              // // Creates Secure Cookie with refresh token
              // res.cookie('refresh', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
              res.json({ roles, accessToken })
          }
      );
    }catch(e){
        functionResponseError(e, res)
    }
    
 }