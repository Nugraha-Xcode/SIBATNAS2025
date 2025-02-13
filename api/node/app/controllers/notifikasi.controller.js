const db = require("../models");
const notifikasi = db.notifikasi;
const user = db.user;

const option = {
  order: [["id", "DESC"]],
  offset: 0,
  limit: 30,
  include: [
    {
      model: user,
      as: "user",
      attributes: ["id", "uuid", "username"],
    },
  ],
  attributes: [
    "uuid",
    "waktuKirim",
    "waktuBaca",
    "subjek",
    "pesan",
    "sudahBaca",
  ],
};
exports.findAll = (req, res) => {
  notifikasi
    .findAll(option)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Aktifitas.",
      });
    });
};

exports.findAllUser = (req, res) => {
  const uuid = req.params.uuid;
  user
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.send([]);
        //return res.status(404).send({ message: "User Not found." });
      } else {
        notifikasi
          .findAll({
            where: {
              userId: data.id,
            },
            order: [["id", "DESC"]],
            offset: 0,
            limit: 30,
            include: [
              {
                model: user,
                as: "user",
                attributes: ["id", "uuid", "username"],
              },
            ],
            attributes: [
              "uuid",
              "waktuKirim",
              "waktuBaca",
              "subjek",
              "pesan",
              "sudahBaca",
            ],
          })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving Notifikasi.",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};
