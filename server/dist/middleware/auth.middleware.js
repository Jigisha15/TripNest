'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.authenticate = void 0
const jwt_1 = require('../utils/jwt')
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      })
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      })
    }
    const token = authHeader.split(' ')[1]
    const payload = (0, jwt_1.verifyToken)(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}
exports.authenticate = authenticate
