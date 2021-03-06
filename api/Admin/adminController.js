const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Meeting = mongoose.model('Meeting'),
    Story = mongoose.model('Story');

exports.delete_all = async (req, res) => {

  try {
    await Story.deleteMany();
    await Meeting.deleteMany();
    await User.deleteMany();

    res.send('Deleted Everything');
  } catch (err) {
    res.status(500).send(err);
  }

};
