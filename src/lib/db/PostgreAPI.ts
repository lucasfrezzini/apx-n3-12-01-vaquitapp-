import { getPurchaseModel } from "./index";
import { getSequelize } from "./sequelize";

class PostgreAPI {
  private initialized = false;

  private async ensureConnection() {
    if (!this.initialized) {
      this.initialized = true;
      try {
        await getSequelize().authenticate();
        console.log("Database connection established");
      } catch (e) {
        console.error("Unable to connect to the database:", e);
      }
    }
  }

  private get Purchase() {
    return getPurchaseModel();
  }

  async createPurchase(data) {
    await this.ensureConnection();
    return await this.Purchase.create(data);
  }

  async updatePurchase(id, updateData) {
    await this.ensureConnection();
    const purchase = await this.Purchase.findByPk(id);
    if (!purchase) throw new Error("Purchase not found");
    return await purchase.update(updateData);
  }

  async getPurchases() {
    await this.ensureConnection();
    return await this.Purchase.findAll();
  }

  async getPurchasesApproved(): Promise<any[]> {
    await this.ensureConnection();
    return await this.Purchase.findAll({ where: { state: "confirmed" } });
  }

  async getPurchaseById(id) {
    await this.ensureConnection();
    return await this.Purchase.findByPk(id);
  }

  async sync() {
    await this.ensureConnection();
    await getSequelize().sync({ alter: true });
  }
}

export default PostgreAPI;
