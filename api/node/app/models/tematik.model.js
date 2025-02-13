module.exports = (sequelize, DataTypes) => {
  const tematik = sequelize.define("tematik", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    is_series: {
      type: DataTypes.BOOLEAN,
    },
  });

  return tematik;
};
