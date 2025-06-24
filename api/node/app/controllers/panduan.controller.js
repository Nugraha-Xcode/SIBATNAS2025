const db = require("../models");
const { v4: uuidv4 } = require("uuid");

const Panduan = db.panduan;


exports.getAllPanduan = (req, res) => {
  Panduan.findAll({
    where: { is_active: true },
    order: [['order', 'ASC']]
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving panduan."
      });
    });
};


exports.createPanduan = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).send({
        message: "Title and content cannot be empty!"
      });
    }

    // Cek jika order sudah digunakan
    const existingOrder = await Panduan.findOne({
      where: { order: req.body.order || 0, is_active: true }
    });

    if (existingOrder) {
      return res.status(409).send({
        message: `Urutan ${req.body.order || 0} sudah digunakan oleh panduan lain.`
      });
    }

    const panduan = {
      uuid: uuidv4(),
      title: req.body.title,
      content: req.body.content,
      order: req.body.order || 0,
      is_active: req.body.is_active !== undefined ? req.body.is_active : true
    };

    const createdPanduan = await Panduan.create(panduan);
    res.status(201).send(createdPanduan);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Panduan."
    });
  }
};

// Update a panduan
exports.updatePanduan = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const existingPanduan = await Panduan.findOne({ where: { uuid } });

    if (!existingPanduan) {
      return res.status(404).send({
        message: "Panduan not found."
      });
    }

    // Cek jika order diubah dan sudah digunakan panduan lain
    if (
      req.body.order !== undefined &&
      req.body.order !== existingPanduan.order
    ) {
      const orderExists = await Panduan.findOne({
        where: {
          order: req.body.order,
          is_active: true,
          uuid: { [db.Sequelize.Op.ne]: uuid }  // pastikan bukan dirinya sendiri
        }
      });

      if (orderExists) {
        return res.status(400).send({
          message: `Urutan ${req.body.order} sudah digunakan oleh panduan lain.`
        });
      }
    }

    const updateData = {
      title: req.body.title || existingPanduan.title,
      content: req.body.content || existingPanduan.content,
      order:
        req.body.order !== undefined ? req.body.order : existingPanduan.order,
      is_active:
        req.body.is_active !== undefined
          ? req.body.is_active
          : existingPanduan.is_active
    };

    const [num] = await Panduan.update(updateData, {
      where: { uuid }
    });

    if (num !== 1) {
      return res.status(500).send({
        message: "Error updating Panduan."
      });
    }

    const updatedPanduan = await Panduan.findOne({
      where: { uuid },
      attributes: { exclude: ["id"] }
    });

    res.send(updatedPanduan);
  } catch (err) {
    res.status(500).send({
      message: `Could not update Panduan: ${err.message}`
    });
  }
};



exports.deletePanduan = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    const [num] = await Panduan.update(
      { is_active: false },
      { where: { uuid: uuid } }
    );

    if (num !== 1) {
      return res.status(404).send({
        message: `Cannot delete Panduan with uuid=${uuid}. Maybe Panduan was not found!`
      });
    }

    res.send({
      message: "Panduan was deleted successfully!"
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not delete Panduan: ${err.message}`
    });
  }
};


exports.getPanduanByUuid = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    const panduan = await Panduan.findOne({ 
      where: { uuid: uuid, is_active: true },
      attributes: { exclude: ['id'] } 
    });

    if (!panduan) {
      return res.status(404).send({
        message: "Panduan not found."
      });
    }

    res.send(panduan);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving Panduan"
    });
  }
};


exports.getAllPublicPanduan = async (req, res) => {
  try {
    const data = await Panduan.findAll({
      where: { is_active: true },
      order: [['order', 'ASC']],
      attributes: ['uuid', 'title', 'order', "content", "is_active"]
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving public panduan."
    });
  }
};

// Get single public panduan detail by UUID
exports.getPublicPanduanByUuid = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    const panduan = await Panduan.findOne({ 
      where: { 
        uuid: uuid, 
        is_active: true 
      },
      attributes: ['uuid', 'title', 'content', 'order']
    });

    if (!panduan) {
      return res.status(404).send({
        message: "Panduan not found or not available."
      });
    }

    res.send(panduan);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving Public Panduan"
    });
  }
};
