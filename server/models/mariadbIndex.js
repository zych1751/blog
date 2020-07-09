import Sequelize from 'sequelize';
import MariadbAccount from './account';
import MariadbCategory from './category';
import MariadbPost from './mariadbPost';

const mariadbDatabase = process.env.MARIADB_DATABASE;
const mariadbUsername = process.env.MARIADB_USERNAME;
const mariadbPassword = process.env.MARIADB_PASSWORD;
const checkEmpty = (str) => {
    return str === "" || str === undefined;
}
if(checkEmpty(mariadbDatabase) || checkEmpty(mariadbUsername) || checkEmpty(mariadbPassword)) {
    console.log("environment variables MARIADB_DATABASE, MARIADB_USERNAME, MARIADB_PASSWORD needed");
    process.exit(1);
}

const sequelize = new Sequelize(mariadbDatabase, mariadbUsername, mariadbPassword, {
    host: 'localhost',
    dialect: 'mariadb',
   
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

const mariadbAccount = MariadbAccount(sequelize, Sequelize);
const mariadbCategory = MariadbCategory(sequelize, Sequelize);
const mariadbPost = MariadbPost(sequelize, Sequelize);

// connection
mariadbCategory.belongsTo(mariadbCategory, { as: 'parent', foreignKey: 'parent_id' });
mariadbCategory.hasMany(mariadbCategory, { as: 'children', foreignKey: 'parent_id', onDelete: 'cascade' });

mariadbCategory.hasMany(mariadbPost, { as: 'postsByMain', foreignKey: 'main_category_id', sourceKey: 'id', onDelete: 'cascade' });
mariadbPost.belongsTo(mariadbCategory, { as: 'mainCategory', foreignKey: 'main_category_id', targetKey: 'id' });
mariadbCategory.hasMany(mariadbPost, { as: 'postsBySub', foreignKey: 'sub_category_id', sourceKey: 'id', onDelete: 'cascade' });
mariadbPost.belongsTo(mariadbCategory, { as: 'subCategory', foreignKey: 'sub_category_id', targetKey: 'id' });

mariadbAccount.sync();
mariadbCategory.sync();
mariadbPost.sync();

const db = {}
db.Account = mariadbAccount;
db.Category = mariadbCategory;
db.Post = mariadbPost;
db.sequelize = sequelize;

export default db;