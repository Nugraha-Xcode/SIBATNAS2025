module.exports = (sequelize, DataTypes) => {
  const statusPemeriksaan = sequelize.define("statusPemeriksaan", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return statusPemeriksaan;
};
