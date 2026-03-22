import { DataTypes } from "sequelize";
import { getSequelize } from "./sequelize";

let Purchase: ReturnType<typeof definePurchaseModel> | null = null;

function definePurchaseModel(sequelize: any) {
  return sequelize.define("Purchase", {
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
}

export function getPurchaseModel() {
  if (!Purchase) {
    Purchase = definePurchaseModel(getSequelize());
  }
  return Purchase;
}
