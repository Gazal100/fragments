const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const md = require('markdown-it')();

module.exports = async (req, res) => {
  let id = req.params.id;
  const user = req.user;

  const Id = id.split('.');
  id = Id[0];
  var extension;
  if (Id.length > 1) {
    extension = Id[1];
  } else {
    extension = null;
  }

  try {
    var format = null;
    const fragment_data = await Fragment.byId(user, id);

    let type = fragment_data.mimeType;

    if (extension === 'html') {
      format = 'text/html';
    } else if (extension === 'txt') {
      format = 'text/plain';
    } else if ('text' + extension === type) {
      format = type;
    } else if (extension) {
      format = 'invalid';
    }

    if (!fragment_data.formats.includes(format) && format != null) {
      return createErrorResponse(
        res.status(415).json({
          message: 'Invalid type conversion, only markdown to HTML is supported[as of now]',
        })
      );
    } else {
      try {
        if (extension === 'html' && fragment_data.mimeType === 'text/markdown') {
          type = 'text/html';
        }
        const raw_data = await fragment_data.getData();
        const data = convertData(raw_data, type);

        res.setHeader('Content-Type', type);

        return createSuccessResponse(res.status(200).send(data));
      } catch (err) {
        console.error('Error fetching fragment data:', err);
        return createErrorResponse(
          res.status(500).json({
            code: 500,
            message: 'No data Found',
          })
        );
      }
    }
  } catch (err) {
    console.error('Error fetching fragment:', err);
    return createErrorResponse(
      res.status(404).json({
        message: 'Fragment not Found',
      })
    );
  }
};

function convertData(data, contentType) {
  if (contentType === 'text/html') {
    return md.render(data.toString());
  } else if (contentType === 'text/plain') {
    return data.toString();
  } else {
    return data;
  }
}
