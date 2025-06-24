module.exports = (sequelize, DataTypes) => {
  const panduan = sequelize.define("panduan", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['uuid']
      }
    ],
    // hook untuk validasi panjang konten
    hooks: {
      beforeValidate: (panduan) => {
        // Batasi ukuran konten jika terlalu besar
        if (panduan.content && panduan.content.length > 16777215) { 
          throw new Error('Konten terlalu panjang');
        }
      }
    }
  });

  return panduan;
};