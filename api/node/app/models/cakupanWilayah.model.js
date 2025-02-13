module.exports = (sequelize, DataTypes) => {
  const cakupanWilayah = sequelize.define("cakupanWilayah", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return cakupanWilayah;
};
