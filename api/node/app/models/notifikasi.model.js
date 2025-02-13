module.exports = (sequelize, DataTypes) => {
  const notifikasi = sequelize.define("notifikasi", {
    uuid: {
      type: DataTypes.STRING,
    },
    waktuKirim: {
      type: DataTypes.DATE,
    },
    waktuBaca: {
      type: DataTypes.DATE,
    },
    subjek: {
      type: DataTypes.STRING,
    },
    pesan: {
      type: DataTypes.STRING,
    },
    sudahBaca: {
      type: DataTypes.BOOLEAN,
    },
  });

  return notifikasi;
};
