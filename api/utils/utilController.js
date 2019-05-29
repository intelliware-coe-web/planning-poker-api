exports.returnResponse = function(res) {
    return function (err, body) {
        err ? res.send(err) : res.json(body);
    };
}

exports.returnDeleteResponse = function(res) {
    return function (err, body) {
        err ? res.send(err) : res.json({ message: 'Delete successful' });
    };
}