// Desc: Model for the Purchases table in the database

import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export const Purchase = sequelize.define("Purchase", {
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
