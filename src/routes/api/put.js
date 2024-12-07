const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  let fragmentId = req.params.id;

  try {
    const fragment = await Fragment.byId(req.user, fragmentId);

    const type = fragment.type;
    const updateType = req.get('Content-type');
    if (type === updateType) {
      await fragment.setData(req.body);
      res.status(200).json(createSuccessResponse({ status: 'ok', fragment: fragment }));
    } else {
      res.status(400).json(
        createErrorResponse(400, {
          message: "A fragment's type can not be changed after it is created",
        })
      );
    }
  } catch (err) {
    console.log(err);
    return createErrorResponse(res.status(404).json({ message: 'Fragment not Found' }));
  }
};
