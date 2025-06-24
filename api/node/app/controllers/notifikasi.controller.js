const db = require("../models");
const notifikasi = db.notifikasi;
const user = db.user;

const { Op, fn, col, where } = require("sequelize");

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
  const { page = 0, size = 30, keyword = '' } = req.query;

  user
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.send({ records: [], totalItems: 0 });
      } else {
        // Construct search condition
        const searchCondition = keyword ? {
          [Op.or]: [
            { subjek: { [Op.iLike]: `%${keyword}%` } },
            { pesan: { [Op.iLike]: `%${keyword}%` } }
          ]
        } : {};

        // Find notifications with pagination and search
        const { count, rows } = await notifikasi.findAndCountAll({
          where: {
            userId: data.id,
            ...searchCondition
          },
          order: [["id", "DESC"]],
          limit: size,
          offset: page * size,
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
        });

        res.send({
          records: rows,
          totalItems: count,
          totalPages: Math.ceil(count / size),
          currentPage: page
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

exports.findAllUserUnread = (req, res) => {
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
            include: [
              {
                model: user,
                as: "user",
                attributes: ["id", "uuid", "username"],
              },
            ],
            attributes: [
              "uuid",
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


exports.updateReadStatus = async (req, res) => {
  console.log("User from token:", req.userId); // or req.user
  console.log("UUID param:", req.params.uuid);

  const uuid = req.params.uuid;
  try {
    const result = await notifikasi.update(
      {
        sudahBaca: true,
        waktuBaca: new Date(),
      },
      {
        where: { uuid: uuid },
      }
    );
    
    if (result[0] === 1) {
      res.send({ message: "Notification was updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Notification with uuid=${uuid}. Maybe Notification was not found!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating Notification with uuid=" + uuid,
    });
  }
};