exports.compose = async (service, req, res) => {
    try {
        return res.json(await service(req));
    } catch (err) {
        return res.status(500).send(err);
    }
};
