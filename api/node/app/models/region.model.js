module.exports = (sequelize, DataTypes) => {
  const region = sequelize.define("region", {
    uuid: {
      type: DataTypes.STRING,
    },
    kode: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    has_geometry: {
      type: DataTypes.BOOLEAN,
    },
    is_grass: {
      type: DataTypes.BOOLEAN,
    },
    filename: {
      type: DataTypes.STRING,
    },
    urlGeoserver: {
      type: DataTypes.STRING,
    },
    geom: {
      type: DataTypes.GEOMETRY("POLYGON", 4326),
    },
  });

  return region;
};
