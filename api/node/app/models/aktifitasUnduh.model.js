module.exports = (sequelize, DataTypes) => {
  const aktifitasUnduh = sequelize.define("aktifitasUnduh", {
    uuid: {
      type: DataTypes.STRING,
    },
    wilayah: {
      type: DataTypes.STRING,
    },
    wilayahName: {
      type: DataTypes.STRING,
    },
    waktuMulai: {
      type: DataTypes.DATE,
    },
    waktuSelesai: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    urlUnduh: {
      type: DataTypes.TEXT,
    },
  });

  return aktifitasUnduh;
};
