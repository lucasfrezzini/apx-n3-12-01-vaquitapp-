import { Purchase } from "./index";
import { sequelize } from "./sequelize";

class PostgreAPI {
  private initialized = false;

  private async ensureConnection() {
    if (!this.initialized) {
      this.initialized = true;
      try {
        await sequelize.authenticate();
        console.log("Database connection established");
      } catch (e) {
        console.error("Unable to connect to the database:", e);
      }
    }
  }

  async createPurchase(data) {
    await this.ensureConnection();
    return await Purchase.create(data);
  }

  async updatePurchase(id, updateData) {
    await this.ensureConnection();
    const purchase = await Purchase.findByPk(id);
    if (!purchase) throw new Error("Purchase not found");
    return await purchase.update(updateData);
  }

  async getPurchases() {
    await this.ensureConnection();
    return await Purchase.findAll();
  }

  async getPurchasesApproved(): Promise<any[]> {
    await this.ensureConnection();
    return await Purchase.findAll({ where: { state: "confirmed" } });
  }

  async getPurchaseById(id) {
    await this.ensureConnection();
    return await Purchase.findByPk(id);
  }

  async sync() {
    await this.ensureConnection();
    await sequelize.sync({ alter: true });
  }
}

export default PostgreAPI;
