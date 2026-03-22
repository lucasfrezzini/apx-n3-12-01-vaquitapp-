import { Sequelize } from "sequelize";
import pg from "pg";

let sequelizeInstance: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    sequelizeInstance = new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectModule: pg,
    });
  }
  return sequelizeInstance;
}

export const sequelize = {
  get connection() {
    return getSequelize();
  },
  authenticate: () => getSequelize().authenticate(),
  sync: (options?: any) => getSequelize().sync(options),
};
