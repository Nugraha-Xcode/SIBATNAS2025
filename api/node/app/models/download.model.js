module.exports = (sequelize, Sequelize) => {
  const Download = sequelize.define("downloads", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    file_name: {
      type: Sequelize.STRING(500),  
      allowNull: false
    },
    download_date: {
      type: Sequelize.DATEONLY, 
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    download_time: {
      type: Sequelize.DATE,  
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    user_uuid: {
      type: Sequelize.UUID,  
      allowNull: true
    },
    file_type: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: 'general'
    }
  }, {
    indexes: [
      {
        fields: ['download_date'],
        name: 'idx_download_date'
      },
      {
        fields: ['user_uuid'],
        name: 'idx_user_uuid'
      },
      {
        fields: ['file_type'],
        name: 'idx_file_type'
      },
      {
        fields: ['ip_address', 'download_date'],
        name: 'idx_ip_download_date'
      }
    ],
    tableName: 'downloads'  
  });

  return Download;
};