"use server";

import { createSingleProductPreference } from "@/lib/mercadopago";
import { createPurchase } from "@/lib/purchases";
import { redirect } from "next/navigation";

export async function donateAction(data: FormData) {
  const name = data.get("name") as string;
  const message = data.get("message") as string;
  const amount = Number(data.get("amount"));

  if (!name || name.trim().length === 0) {
    throw new Error("El nombre es requerido");
  }

  if (!amount || amount <= 0 || isNaN(amount)) {
    throw new Error("El monto debe ser un numero mayor a 0");
  }

  const newPurchId = await createPurchase({
    from: name.trim(),
    amount,
    message: message || "",
  });

  try {
    const newPref = await createSingleProductPreference({
      productName: "Donation",
      productDescription: message || "",
      productId: newPurchId,
      productPrice: amount,
      transactionId: newPurchId,
    });
    redirect(newPref.init_point);
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error);
    throw new Error("Error al procesar el pago. Intenta novamente.");
  }
}
