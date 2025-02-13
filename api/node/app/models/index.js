const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.PORT,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//db.images = require("./image.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(
  sequelize,
  Sequelize
);

db.kategoriTematik = require("./kategoriTematik.model.js")(
  sequelize,
  Sequelize
);
db.produsen = require("./produsen.model.js")(sequelize, Sequelize);
db.tematik = require("./tematik.model.js")(sequelize, Sequelize);

db.eksternal = require("./eksternal.model.js")(sequelize, Sequelize);
//db.kategoriEksternal = require("./kategoriEksternal.model.js")(
sequelize, Sequelize;
//);

/*
Kementerian/Lembaga
Pemda Provinsi
Pemda Kabupaten/Kota
Perguruan Tinggi
BUMN
*/
//db.mekanismeEksternal = require("./mekanismeEksternal.model.js")(
//  sequelize,
//  Sequelize
//);
/*
permohonan
perjanjian
*/

//db.region = require("./region.model.js")(sequelize, Sequelize);
//db.province = require("./province.model.js")(sequelize, Sequelize);

db.dataProdusen = require("./dataProdusen.model.js")(sequelize, Sequelize);
db.statusPemeriksaan = require("./statusPemeriksaan.model.js")(
  sequelize,
  Sequelize
);
db.dataPemeriksaan = require("./dataPemeriksaan.model.js")(
  sequelize,
  Sequelize
);
db.dataPerbaikanProdusen = require("./dataPerbaikanProdusen.model.js")(
  sequelize,
  Sequelize
);
db.dataPublikasi = require("./dataPublikasi.model.js")(sequelize, Sequelize);
db.record = require("./record.model.js")(sequelize, Sequelize);
db.aktifitasUnduh = require("./aktifitasUnduh.model.js")(sequelize, Sequelize);

db.notifikasi = require("./notifikasi.model.js")(sequelize, Sequelize);
db.setting = require("./setting.model.js")(sequelize, Sequelize);
db.keywords = require("../models/keywords.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

db.kategoriTematik.hasMany(db.produsen, { as: "produsen" });
db.produsen.belongsTo(db.kategoriTematik, {
  foreignKey: "kategoriTematikId",
  as: "kategoriTematik",
});

db.produsen.hasMany(db.tematik, { as: "tematik" });
db.tematik.belongsTo(db.produsen, {
  foreignKey: "produsenId",
  as: "produsen",
});

//db.kategoriEksternal.hasMany(db.eksternal, { as: "eksternal" });
//db.eksternal.belongsTo(db.kategoriEksternal, {
//  foreignKey: "kategoriEksternalId",
//  as: "kategoriEksternal",
//});

//db.province.hasMany(db.region, { as: "region" });
//db.region.belongsTo(db.province, {
// foreignKey: "provinceId",
//  as: "province",
//});

db.produsen.belongsToMany(db.user, {
  through: "produsen_user",
  foreignKey: "produsenId",
  otherKey: "userId",
});

db.user.belongsToMany(db.produsen, {
  through: "produsen_user",
  foreignKey: "userId",
  otherKey: "produsenId",
});

//db.eksternal.belongsToMany(db.user, {
//  through: "eksternal_user",
//  foreignKey: "eksternalId",
//  otherKey: "userId",
//});

//db.user.belongsToMany(db.eksternal, {
//  through: "eksternal_user",
//  foreignKey: "userId",
//  otherKey: "eksternalId",
//});

db.tematik.hasMany(db.dataProdusen, { as: "dataProdusen" });
db.dataProdusen.belongsTo(db.tematik, {
  foreignKey: "tematikId",
  as: "tematik",
});

db.user.hasMany(db.dataProdusen, { as: "dataProdusen" });
db.dataProdusen.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.statusPemeriksaan.hasMany(db.dataPemeriksaan, { as: "dataPemeriksaan" });
db.dataPemeriksaan.belongsTo(db.statusPemeriksaan, {
  foreignKey: "statusPemeriksaanId",
  as: "statusPemeriksaan",
});

db.dataProdusen.hasMany(db.dataPemeriksaan, { as: "dataPemeriksaan" });
db.dataPemeriksaan.belongsTo(db.dataProdusen, {
  foreignKey: "dataProdusenId",
  as: "dataProdusen",
});

db.dataPemeriksaan.hasMany(db.dataPerbaikanProdusen, {
  as: "dataPerbaikanProdusen",
});
db.dataPerbaikanProdusen.belongsTo(db.dataPemeriksaan, {
  foreignKey: "dataPemeriksaanId",
  as: "dataPemeriksaan",
});
db.statusPemeriksaan.hasMany(db.dataPerbaikanProdusen, {
  as: "dataPerbaikanProdusen",
});
db.dataPerbaikanProdusen.belongsTo(db.statusPemeriksaan, {
  foreignKey: "statusPemeriksaanId",
  as: "statusPemeriksaan",
});

db.user.hasMany(db.dataPemeriksaan, { as: "dataPemeriksaan" });
db.dataPemeriksaan.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.user.hasMany(db.dataPerbaikanProdusen, { as: "dataPerbaikanProdusen" });
db.dataPerbaikanProdusen.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.dataPemeriksaan.hasMany(db.dataPublikasi, { as: "dataPublikasi" });
db.dataPublikasi.belongsTo(db.dataPemeriksaan, {
  foreignKey: "dataPemeriksaanId",
  as: "dataPemeriksaan",
});

db.user.hasMany(db.dataPublikasi, { as: "dataPublikasi" });
db.dataPublikasi.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.tematik.hasMany(db.dataPublikasi, { as: "dataPublikasi" });
db.dataPublikasi.belongsTo(db.tematik, {
  foreignKey: "tematikId",
  as: "tematik",
});

db.dataPublikasi.hasMany(db.aktifitasUnduh, { as: "aktifitasUnduh" });
db.aktifitasUnduh.belongsTo(db.dataPublikasi, {
  as: "dataPublikasi",
  foreignKey: "dataPublikasiId",
});

db.user.hasMany(db.aktifitasUnduh, { as: "aktifitasUnduh" });
db.aktifitasUnduh.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.user.hasMany(db.notifikasi, { as: "notifikasi" });
db.notifikasi.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.ROLES = ["admin", "walidata", "walidata_pendukung", "produsen", "eksternal"];

module.exports = db;
