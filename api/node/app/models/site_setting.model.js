module.exports = (sequelize, DataTypes) => {
  const site_setting = sequelize.define("site_setting", {
    uuid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    institusi: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    telp: {
      type: DataTypes.STRING,
    },
    fax: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    coverage_area: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING,
    },
    format_background: {
      type: DataTypes.STRING,
    },
    background: {
      type: DataTypes.STRING,
    },
  });

  return site_setting;
};
