module.exports = {
  HOST: "db-app", //HOST: "172.16.3.163",
  USER: "postgres",
  PASSWORD: "postgre55",
  DB: "sibatnas_app",
  PORT: 5432, //PORT: 5432
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
