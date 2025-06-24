module.exports = (sequelize, DataTypes) => {
  const dataPublikasi = sequelize.define("dataPublikasi", {
    uuid: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    waktuPublish: {
      type: DataTypes.DATE,
    },
    filename: {
      type: DataTypes.STRING,
    },
    pdfname: {
      type: DataTypes.STRING,
    },
    metadatafilename: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
      unique: true,
    },
    urlGeoserver: {
      type: DataTypes.STRING,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
    },
  });

  return dataPublikasi;
};
