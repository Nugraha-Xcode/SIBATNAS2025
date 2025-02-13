const db = require("../models");
const cakupanWilayah = db.cakupanWilayah;

exports.findAll = (req, res) => {
  cakupanWilayah
    .findAll({
      order: [["name", "ASC"]],
      attributes: ["uuid", "name"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Cakupan Wilayah.",
      });
    });
};
