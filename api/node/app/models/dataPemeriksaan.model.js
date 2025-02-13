module.exports = (sequelize, DataTypes) => {
  const dataPemeriksaan = sequelize.define("dataPemeriksaan", {
    uuid: {
      type: DataTypes.STRING,
    },
    kategori: {
      type: DataTypes.STRING,
    },
    filename: {
      type: DataTypes.STRING,
    },
    need_reupload: {
      type: DataTypes.BOOLEAN,
    },
  });

  return dataPemeriksaan;
};
