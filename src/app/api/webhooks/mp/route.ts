import { getPaymentById, WebhokPayload } from "@/lib/mercadopago";
import { confirmPurchase } from "@/lib/purchases";
import PostgreAPI from "@/lib/db/PostgreAPI";

const db = new PostgreAPI();

export async function POST(request: Request, { params }) {
  const body: WebhokPayload = await request.json();
  console.log("Webhook received", body);

  if (body.type === "payment") {
    const mpPayment = await getPaymentById(body.data.id);
    if (mpPayment.status === "approved") {
      console.log(`Payment ${mpPayment.id} approved`);
      const purchaseId = mpPayment.external_reference;

      const purchase = await db.getPurchaseById(purchaseId);
      if (purchase && purchase.dataValues.state === "confirmed") {
        console.log(`Purchase ${purchaseId} already confirmed, skipping`);
        return Response.json({ received: true });
      }

      await confirmPurchase(purchaseId);
    }
  }

  return Response.json({ received: true });
}
