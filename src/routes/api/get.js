// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {

  let fragment_list = []; 
  const expand = req.query.expand;

  if (expand == 1) {
    fragment_list = await Fragment.byUser(req.user, true);
  } else {
    fragment_list = await Fragment.byUser(req.user, false);
  }
  
  res.status(200).json(
    createSuccessResponse({
      fragments: fragment_list, 
    })
  );
};

