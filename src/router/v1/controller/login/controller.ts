
import { Request,Response,NextFunction } from "express"
import { UserModel } from "../../../../models"
import functionResponseError from '../../components/responseError'
import passwordHash from 'password-hash'
import { jwtSign } from "../../../../../config/util"


 
export  const createLogin =async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await UserModel.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await passwordHash.verify(password, `${foundUser?.password}`);
    if (match) {
        const roles = foundUser.role
        // create JWTs
        const accessToken = await jwtSign(
          {
            id: foundUser?._id,
            role: foundUser?.role,
          },
          "1m"
        );
        const newRefreshToken =  await jwtSign(
          {
            id: foundUser?._id,
            role: foundUser?.role,
          },
          "1d"
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.refresh
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter((rt:any )=> rt !== cookies.refresh);

        if (cookies?.refresh) {

            /* 
            Scenario added here: 
                1) UserModel logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when username logs in
            */
            const refreshToken = cookies.refresh;
            const foundToken = await UserModel.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!')
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('refresh', { httpOnly: true, sameSite: 'none', secure: true });
        }

        // Saving refreshToken with current username
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('refresh', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to username
        res.json({ roles, accessToken });

    } else {
        res.sendStatus(401);
    }
    }catch(e){
        functionResponseError(e, res)

    }
    
 }