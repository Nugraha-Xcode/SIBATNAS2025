const db = require("../models");
const User = db.user;
const Table = db.contact;
const Op = db.Sequelize.Op;
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const order = {
  order: [["createdAt", "DESC"]],
  attributes: [
    "uuid",
    "name",
    "address",
    "phone",
    "email",
    "whatsapp",
    "createdAt",
    "updatedAt",
  ],
};

// Create and Save a new User
exports.create = async (req, res) => {
  try {
    var { name, address, phone, email, whatsapp } = req.body;
    if (!address || !phone || !email || !whatsapp) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // Create a Tutorial
    const row = {
      uuid: uuidv4(),
      name: name,
      address: address,
      phone: phone,
      email: email,
      whatsapp: whatsapp,
    };

    // Save Radius in the table
    Table.create(row)
      .then((data) => {
        Table.findByPk(data.id)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the contact.",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the contact.",
    });
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  // const question = req.query.question;
  // var condition = question ? { question: { [Op.iLike]: `%${question}%` } } : null;

  Table.findAll({
    // where: condition,
    attributes: [
      "uuid",
      "name",
      "address",
      "phone",
      "email",
      "whatsapp",
      "createdAt",
      "updatedAt",
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving contact.",
      });
    });
};

exports.findLatestFive = (req, res) => {
  // const name = req.query.type;
  // var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Table.findAll({
    // where: condition,
    offset: 0,
    limit: 5,
    attributes: [
      "uuid",
      "name",
      "address",
      "phone",
      "email",
      "whatsapp",
      "createdAt",
      "updatedAt",
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving contact.",
      });
    });
};

// Find a single faq with an id
exports.findByUuid = (req, res) => {
  const id = req.params.uuid;

  Table.findByPk(id, {
    attributes: [
      "uuid",
      "name",
      "address",
      "phone",
      "email",
      "whatsapp",
      "createdAt",
      "updatedAt",
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find contact with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving contact with id=" + id,
      });
    });
};

exports.findNumber = async (req, res) => {
  try {
    const userCount = await db.user.count();
    const produsenCount = await db.produsen.count();
    const recordCount = await db.record.count();

    const stats = {
      user: userCount,
      produsen: produsenCount,
      dataset: recordCount,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  Table.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "contact tidak ditemukan." });
      } else {
        Table.update(req.body, {
          where: { uuid: uuid },
        })
          .then((num) => {
            if (num == 1) {
              Table.findByPk(data.id, order)
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the contact.",
                  });
                });
            } else {
              res.send({
                message: `Cannot update contact with uuid=${uuid}. Maybe contact was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating contact with uuid=" + uuid,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving contact with uuid=" + uuid,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const uuid = req.params.uuid;

  Table.destroy({
    where: { uuid: uuid },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "contact was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete contact with id=${uuid}. Maybe contact was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete contact with id=" + uuid,
      });
    });
};
