import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const Product = db.define('product',{
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    url: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING
},{
    freezeTableName: true
});
 
export default Product;
 
(async()=>{
    await db.sync();
})();