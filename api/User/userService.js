const mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.list_users = async () => {
    return await User.find();
};

exports.create_user = async (req) => {
    let user = await User.findOne({name: req.body.name});
    if (user == null) {
        let new_user = new User(req.body);
        user = await new_user.save();
    }
    return user;
};

exports.get_user = async (req) => {
    return await User.findById(req.params.userId);
};

exports.delete_user = async (req) => {
    await User.deleteOne({_id: req.params.userId});
    return {message: 'User successfully deleted'};
};