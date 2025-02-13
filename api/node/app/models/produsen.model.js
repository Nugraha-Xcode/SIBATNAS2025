module.exports = (sequelize, DataTypes) => {
  const produsen = sequelize.define("produsen", {
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

  return produsen;
};
