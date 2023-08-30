
import { Request,Response,NextFunction } from "express"
import { UserModel } from "../../../../models"
import functionResponseError from '../../components/responseError'



 
export  const handleLogout =async (req:Request,res:Response,next:NextFunction)=>{
    try{
     // On client, also delete the accessToken
     const cookies = req.cookies;
     if (!cookies?.refresh) return res.sendStatus(204); //No content
     const refreshToken = cookies.refresh;
     // Is refreshToken in db?
     const foundUser = await UserModel.findOne({ refreshToken }).exec();
     if (!foundUser) {
         res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
         return res.sendStatus(204);
     }
     // Delete refreshToken in db
     foundUser.refreshToken = foundUser.refreshToken.filter((rt:any)=> rt !== refreshToken);;
     const result = await foundUser.save();
     console.log(result);
     res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
     res.status(200).json({
      status: 200,
      code: 'success',
      message: 'success',
    });
    }catch(e){
        functionResponseError(e, res)
    }
    
 }