
import { Request,Response,NextFunction } from "express"
import { UserModel } from "../../../../models"
import functionResponseError from '../../components/responseError'
import passwordHash from 'password-hash'
import { jwtSign } from "../../../../../config/util"
import jwt from "jsonwebtoken"
import config from 'config'


 
export  const getMe =async (req:Request,res:Response,next:NextFunction)=>{
    try{
     // On client, also delete the accessToken
     const cookies = req.cookies;
    //  console.log('cookie',cookies);
     
     if (!cookies?.refresh) return res.sendStatus(204); //No content
     const refreshToken = cookies.refresh;
     jwt.verify(
      refreshToken,
      config.get('jwt.secret'),
      async (err:any, decoded:any) => {
          if (err) {
            console.log('in me ',err);         
            res.status(403).json({
              status: 403,
              code: 'INVALID_TOKEN',
              message: 'Invalid Token',
          })
          }
          const foundUser = await UserModel.findOne({ _id:decoded?.id }).exec();
          console.log('founin me',foundUser);
          
          res.status(200).json(
            {
              firstname:foundUser?.firstname,
              lastname:foundUser?.lastname,
              username:foundUser?.username,
              id:foundUser?._id.toString()
            }
          )
          
        }
        
  );
    
    }catch(e){
        functionResponseError(e, res)
    }
    
 }