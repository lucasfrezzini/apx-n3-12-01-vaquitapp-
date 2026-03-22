import PostgreAPI from "@/lib/db/PostgreAPI";

const db = new PostgreAPI();

type Purchase = {
  id: string;
  from: string;
  amount: number;
  message: string;
  date: Date;
  state: string;
};

export async function getConfirmedPayments(): Promise<Purchase[]> {
  const purchases = await db.getPurchasesApproved();
  return purchases;
}

export async function createPurchase(
  newPurchInput: Pick<Purchase, "from" | "amount" | "message">
): Promise<string> {
  const purchase = {
    ...newPurchInput,
    date: new Date(),
  };
  // guardamos esta nueva purchase en la db y devolvemos el id
  const newPurchase = await db.createPurchase(purchase);
  return newPurchase.dataValues.id;
}

export async function confirmPurchase(purchaseId: string) {
  // confirmamos la compra en la DB
  await db.updatePurchase(purchaseId, { state: "confirmed" });
  return true;
}
