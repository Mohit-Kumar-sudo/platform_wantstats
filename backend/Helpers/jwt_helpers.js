const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const User = require('../Models/User.Model')
const mongoose = require('mongoose')

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.DEV_JWT_SECRET;
      // Check if the secret is undefined
      if (!secret) {
        console.error('JWT Secret is undefined!');
        return reject(createError.InternalServerError('JWT Secret missing'));
      }
      const options = {
        expiresIn: '1d',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) {
      return next(createError.Unauthorized());
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    const secret = process.env.DEV_JWT_SECRET;

    // Check if the secret is undefined
    if (!secret) {
      console.error('JWT Secret is undefined!');
      return next(createError.InternalServerError('JWT Secret missing'));
    }

    JWT.verify(token, secret, async (err, payload) => {
      if (err) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(createError.Unauthorized(message));
      }

      console.log('Payload audience (aud):', payload.aud);

      if (!payload.aud) {
        return next(createError.Unauthorized('Invalid token: no audience provided.'));
      }

      try {
        // Ensure payload.aud is a valid ObjectId string
        if (!mongoose.Types.ObjectId.isValid(payload.aud)) {
          return next(createError.Unauthorized('Invalid user ID'));
        }

        // Find user by the ObjectId converted from the string
        const userId = mongoose.Types.ObjectId(payload.aud); // This is a valid string-to-ObjectId conversion.
        const user = await User.findOne({ _id: userId });

        if (!user) {
          return next(createError.Unauthorized('User not found'));
        }

        req.user = user;
        req.payload = payload;
        next();
      } catch (err) {
        console.error('Error finding user:', err.message);
        return next(createError.InternalServerError('Error processing token.'));
      }
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {} 
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '1y',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          // reject(err)
          reject(createError.InternalServerError())
        }
        resolve(token)

        // client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
        //   if (err) {
        //     console.log(err.message)
        //     reject(createError.InternalServerError())
        //     return
        //   }
        //   resolve(token)
        // })
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized())
          const userId = payload.aud
          resolve(userId)
          // client.GET(userId, (err, result) => {
          //   if (err) {
          //     console.log(err.message)
          //     reject(createError.InternalServerError())
          //     return
          //   }
          //   if (refreshToken === result) return resolve(userId)
          //   reject(createError.Unauthorized())
          // })
        }
      )
    })
  },
}