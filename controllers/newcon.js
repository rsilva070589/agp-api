
const newcon = require('../model/newcon');

async function get(req, res, next) {
  try { 
    const rows = await newcon.find();

    if (1) {
      if (1) {
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

async function post(req, res, next) {
  try { 

     await newcon.updateCota(req.body[0]); 
     res.status(201).json(req.body);
    
  } catch (err) { 
    next(err)

  }
}

module.exports.post = post;