
const login = require('../model/login');

async function get(req, res, next) {
  try {
    const rows = await login.find(req.body);

    if (1) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;

 
 

 
