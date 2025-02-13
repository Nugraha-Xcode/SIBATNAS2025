module.exports = (sequelize, DataTypes) => {
  const keywords = sequelize.define("keywords", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  return keywords;
};
