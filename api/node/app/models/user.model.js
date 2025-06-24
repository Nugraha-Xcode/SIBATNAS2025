module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    uuid: {
      type: Sequelize.STRING,
    },
    fullname: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    is_sso: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    sso_provider: {
      type: Sequelize.STRING,
      allowNull: true, 
    },
    ina_geo_uuid: {
      type: Sequelize.STRING,
      allowNull: true, 
    },
    last_ina_geo_sync: {
      type: Sequelize.DATE,
      allowNull: true, 
    }
  });

  return User;
};