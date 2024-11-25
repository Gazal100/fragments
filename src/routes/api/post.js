const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }

  try {
    // Create a new fragment with the provided data
    const newFragment = new Fragment({
      id: crypto.randomBytes(16).toString('hex'),
      ownerId: req.user || null,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      type: req.headers['content-type'],
      size: Number(req.headers['content-length']),
    });

    await newFragment.save(); // Save the fragment
    await newFragment.setData(req.body); // Set the data for the fragment

    const location = `${req.protocol}://${req.hostname}:8080/v1${req.url}/${newFragment.id}`;
    res.location(location); // Set the Location header

    // Respond with 201 Created and include fragment data in the response body
    return res.status(201).json(createSuccessResponse({
      status: 'ok',
      fragments: {
        id: newFragment.id,
        ownerId: newFragment.ownerId,
        created: newFragment.created,
        updated: newFragment.updated,
        type: newFragment.type,
        size: newFragment.size,
      },
    }));
  } catch (error) {
    // If an error occurs during save or setData, return a 500 response
    console.error('Error creating fragment:', error);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
