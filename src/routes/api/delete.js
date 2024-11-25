const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  let id = req.params.id;
  try {
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse('Deleted the Fragment'));
  } catch (e) {
    res.status(404).json(createErrorResponse(404, e));
  }
};
