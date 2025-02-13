module.exports = (sequelize, DataTypes) => {
  const eksternal = sequelize.define("eksternal", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    akronim: {
      type: DataTypes.STRING,
    },
  });

  return eksternal;
};
