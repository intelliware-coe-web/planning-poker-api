const mongoose = require('mongoose'),
    Story = mongoose.model('Story'),
    Meeting = mongoose.model('Meeting'),
    User = mongoose.model('User');

exports.delete_all = async () => {
    await Story.deleteMany();
    await Meeting.deleteMany();
    await User.deleteMany();
    return {message: 'Deleted Everything'};
};