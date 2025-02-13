module.exports = (sequelize, DataTypes) => {
  const setting = sequelize.define("setting", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    is_final: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  return setting;
};
