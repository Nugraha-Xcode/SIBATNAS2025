const db = require("../models");
const aktifitasUnduh = db.aktifitasUnduh;
const dataProdusen = db.dataProdusen;
const dataPublikasi = db.dataPublikasi;

const tematik = db.tematik;
const dataEksternal = db.dataEksternal;
const igtEksternal = db.igtEksternal;
const dataInternal = db.dataInternal;
const igtInternal = db.igtInternal;
const user = db.user;

const option = {
  include: [
    {
      model: dataProdusen,
      as: "dataProdusen",
      attributes: ["id", "uuid", "deskripsi"],
      include: [
        {
          model: tematik,
          as: "tematik",
          attributes: ["id", "uuid", "name"],
        },
      ],
    },
    {
      model: dataEksternal,
      as: "dataEksternal",
      attributes: ["id", "uuid", "deskripsi"],
      include: [
        {
          model: igtEksternal,
          as: "igtEksternal",
          attributes: ["id", "uuid", "name"],
        },
      ],
    },
  ],
  attributes: [
    "uuid",
    "wilayah",
    "wilayahName",
    "keterangan",
    "waktuMulai",
    "waktuSelesai",
    "status",
    "urlUnduh",
  ],
};

exports.findAll = (req, res) => {
  aktifitasUnduh
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
        aktifitasUnduh
          .findAll({
            where: { userId: data.id },
            order: [["id", "DESC"]],
            offset: 0,
            limit: 20,
            include: [
              {
                model: dataPublikasi,
                as: "dataPublikasi",
                attributes: ["id", "uuid", "deskripsi"],
                include: [
                  {
                    model: tematik,
                    as: "tematik",
                    attributes: ["id", "uuid", "name"],
                  },
                ],
              },
              {
                model: dataEksternal,
                as: "dataEksternal",
                attributes: ["id", "uuid", "deskripsi"],
                include: [
                  {
                    model: igtEksternal,
                    as: "igtEksternal",
                    attributes: ["id", "uuid", "name"],
                  },
                ],
              },
            ],
            attributes: [
              "uuid",
              "wilayah",
              "wilayahName",
              "keterangan",
              "waktuMulai",
              "waktuSelesai",
              "status",
              "urlUnduh",
            ],
          })
          .then((unduhs) => {
            res.send(unduhs);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving Aktifitas.",
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
