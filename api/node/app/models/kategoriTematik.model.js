module.exports = (sequelize, DataTypes) => {
  const kategoriTematik = sequelize.define("kategoriTematik", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return kategoriTematik;
};
