import { NextFunction, Request, Response } from "express"

export const validationUser = (req:Request, res: Response,next:NextFunction) => {
  try {
    const { role, username,password } = req.body
    if (!role || role.trim() === '') {
      res.status(400).json({
        status: 400,
        code: 'ERROR_ROLE_REQUIRED',
        message: 'role is required',
      })
    } else if (!username || username.trim() === '') {
      res.status(400).json({
        status: 400,
        code: 'ERROR_USERNAME_REQUIRED',
        message: 'username is required',
      })
    } else if (!password || password.trim() === '') {
      res.status(400).json({
        status: 400,
        code: 'ERROR_PASSWORD_REQUIRED',
        message: 'password is required',
      })
    }  else {
      next()
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      code: 'ERROR_INTERNAL_SERVER',
      message: 'Unknown Internal Server Error.',
    })
  }
}

