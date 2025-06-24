module.exports = (sequelize, Sequelize) => {
  const Visitor = sequelize.define("visitors", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    visit_date: {
      type: Sequelize.DATEONLY,  
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    user_agent: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    page_url: {
      type: Sequelize.STRING(500),  
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['ip_address', 'visit_date'],
        name: 'unique_visitor_per_day'
      },
      {
        fields: ['visit_date'],
        name: 'idx_visit_date'
      },
      {
        fields: ['ip_address'],
        name: 'idx_ip_address'
      }
    ],
    tableName: 'visitors'  
  });

  return Visitor;
};