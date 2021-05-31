module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Posts", {
      name: {
        type: DataTypes.STRING,
        allowNULL: false,
        validate: {
            notEmpty: true
        }
      },
      about: {
        type: DataTypes.STRING(4000),
        allowNULL: false,
        validate: {
            notEmpty: true
        }
      },
      location: {
        type: DataTypes.STRING(4000),
        allowNULL: false,
        validate: {
            notEmpty: true
        }
      },
      admission: {
        type: DataTypes.STRING(4000),
        allowNULL: false,
        validate: {
            notEmpty: true
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNULL: false,
        validate: {
            notEmpty: true
        }
      },
  });
  // User.associate = (models) => {
  //     User.hasMany(models.Games, {
  //         onDelete: "cascade",
  //         foreignKey: 'user_id'
  //     });
  // }
  return Post;
};