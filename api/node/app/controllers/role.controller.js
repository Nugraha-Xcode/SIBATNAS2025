const db = require("../models");
const Role = db.role;

exports.findAll = (req, res) => {
  Role.findAll({
    order: [["name", "ASC"]],
    attributes: ["id", "name"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Role.",
      });
    });
};
