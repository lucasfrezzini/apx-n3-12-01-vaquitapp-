import { Purchase } from "./index";
import { sequelize } from "./sequelize";

class PostgreAPI {
  constructor() {
    // Para iniciar conexión al instanciar si quieres
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createPurchase(data) {
    return await Purchase.create(data);
  }

  async updatePurchase(id, updateData) {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) throw new Error("Purchase not found");
    return await purchase.update(updateData);
  }

  async getPurchases() {
    return await Purchase.findAll();
  }

  async getPurchasesApproved(): Promise<any[]> {
    return await Purchase.findAll({ where: { state: "confirmed" } });
  }

  async getPurchaseById(id) {
    return await Purchase.findByPk(id);
  }

  // Método para sincronizar el modelo (crear tabla) al inicio de app si quieres
  async sync() {
    await sequelize.sync({ alter: true });
  }
}

export default PostgreAPI;
