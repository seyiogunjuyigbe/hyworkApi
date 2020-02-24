import {codes} from '../helpers/responses'

module.exports = {
    success(res,status){
      return res.status(status).json({
        status,
        data: codes.success[status]
      })
    },
    error(res,status){
      return res.status(status).json({
        status,
        data: codes.error[status]
      })
    }
}