const db = require("../models");
const setting = db.setting;

const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  //var objectValue = JSON.parse(req.body.provinsi);
  //console.log(objectValue);
  //console.log(req.body);

  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  //console.log(req.body.province);
  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
  };

  // Save Tutorial in the database
  setting
    .create(input)
    .then((data) => {
      setting
        .findByPk(data.id)
        .then((pega) => {
          res.send(pega);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Setting.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAktif = (req, res) => {
  return setting
    .findOne()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Setting.",
      });
    });
};

// Update a Kategori by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  setting
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Setting Not found." });
      } else {
        const edit = {
          name: req.body.name,
        };

        //console.log(edit);
        setting
          .update(edit, {
            where: { id: data.id },
          })
          .then((num) => {
            if (num == 1) {
              setting.findByPk(data.id).then((update) => {
                res.send(update);
              });

              //res.send({
              //  message: "Katagori was updated successfully.",
              //});
            } else {
              res.send({
                message: `Cannot update Setting with id=${uuid}. Maybe Setting was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Setting with id=" + uuid,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Setting.",
      });
    });
};
