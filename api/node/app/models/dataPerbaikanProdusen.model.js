module.exports = (sequelize, DataTypes) => {
  const dataPerbaikanProdusen = sequelize.define("dataPerbaikanProdusen", {
    uuid: {
      type: DataTypes.STRING,
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
    urlGeoserver: {
      type: DataTypes.STRING,
    },
    pemeriksaanfilename: {
      type: DataTypes.STRING,
    },
    kategori: {
      type: DataTypes.STRING,
    },
    need_reupload: {
      type: DataTypes.BOOLEAN,
    },
  });

  return dataPerbaikanProdusen;
};
