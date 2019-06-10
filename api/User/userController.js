const mongoose = require('mongoose'),
User = mongoose.model('User');

exports.list_users = async(req, res) => {
  try {
      const users = await User.find();
      return res.json(users);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.create_user = async(req, res) => {
  try {
    let new_user = new User(req.body);
    const user = await new_user.save();
    return res.json(user);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.get_user = async(req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      return res.json(user);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.delete_user = async(req, res) => {
  try {
    await User.remove({_id: req.params.userId});
    return res.json({message: 'User successfully deleted'});
  } catch(err) {
    return sendError(res, err);
  }
};

// TODO: should we pull this out into something generic?
function sendError(res, err) {
    return res.status(500).send(err);
}