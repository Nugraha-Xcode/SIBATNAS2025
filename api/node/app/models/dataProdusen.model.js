module.exports = (sequelize, DataTypes) => {
  const dataProdusen = sequelize.define("dataProdusen", {
    uuid: {
      type: DataTypes.STRING,
    },
    deskripsi: {
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
  });

  return dataProdusen;
};
