module.exports = (sequelize, DataTypes) => {
  const mekanismeEksternal = sequelize.define("mekanismeEksternal", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return mekanismeEksternal;
};
