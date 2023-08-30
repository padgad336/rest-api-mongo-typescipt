import { NextFunction, Request, Response } from 'express'
import functionResponseError from '../components/responseError'
import { UserModel } from 'src/models';

export const businessPdpa = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const cookies = req.cookies;
      if (!cookies?.refresh) return res.status(401).json({
        status: 401,
        code: 'Unauthorized',
        message: 'Unauthorized',
      });
      const refreshToken = cookies.refresh;
      const foundUser = await UserModel.findOne({ refreshToken }).exec();
    if (foundUser.role=='businessPdpa') {
      next()
    } else {
      res.status(403).json({
        status: 403,
        code: 'ERROR_ACCESS',
        message: 'Access denied',
      })
    }
  } catch (error) {
    functionResponseError(error, res)
  }
}
export const admin = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const cookies = req.cookies;
      if (!cookies?.refresh) return res.status(401).json({
        status: 401,
        code: 'Unauthorized',
        message: 'Unauthorized',
      });
      const refreshToken = cookies.refresh;
      const foundUser = await UserModel.findOne({ refreshToken }).exec();
    if (foundUser.role=='admin') {
      next()
    } else {
      res.status(403).json({
        status: 403,
        code: 'ERROR_ACCESS',
        message: 'Access denied',
      })
    }
  } catch (error) {
    functionResponseError(error, res)
  }
}
export const manager = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const cookies = req.cookies;
      if (!cookies?.refresh) return res.status(401).json({
        status: 401,
        code: 'Unauthorized',
        message: 'Unauthorized',
      });
      const refreshToken = cookies.refresh;
      const foundUser = await UserModel.findOne({ refreshToken }).exec();
    if (foundUser.role=='manager') {
      next()
    } else {
      res.status(403).json({
        status: 403,
        code: 'ERROR_ACCESS',
        message: 'Access denied',
      })
    }
  } catch (error) {
    functionResponseError(error, res)
  }
}
export const businessControlCommittee = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const cookies = req.cookies;
      if (!cookies?.refresh) return res.status(401).json({
        status: 401,
        code: 'Unauthorized',
        message: 'Unauthorized',
      });
      const refreshToken = cookies.refresh;
      const foundUser = await UserModel.findOne({ refreshToken }).exec();
    if (foundUser.role=='businessControlCommittee') {
      next()
    } else {
      res.status(403).json({
        status: 403,
        code: 'ERROR_ACCESS',
        message: 'Access denied',
      })
    }
  } catch (error) {
    functionResponseError(error, res)
  }
}


