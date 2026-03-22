"use client";
import { donateAction } from "./actions";
import styles from "./form.module.scss";
import { useEffect } from "react";
import { useActionState } from "react";

type ActionState = { redirectUrl?: string; error?: string } | null;

function submitWithRedirect(_prevState: ActionState, data: FormData): Promise<NonNullable<ActionState>> {
  return donateAction(data) as Promise<NonNullable<ActionState>>;
}

export function DonationForm() {
  const [state, formAction] = useActionState(submitWithRedirect, null);

  useEffect(() => {
    if (state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  return (
    <form
      className={styles.form}
      action={formAction}
    >
      <div className={styles.field}>
        <div className={styles.label}>Nombre</div>
        <input
          className={styles.textField}
          type="text"
          placeholder="Tu nombre"
          name="name"
        />
      </div>
      <div className={styles.field}>
        <div className={styles.label}>Mensaje</div>
        <textarea
          className={styles.textField}
          name="message"
          placeholder="Tu mensaje"
          rows={6}
        />
      </div>
      <div className={styles.field}>
        <div className={styles.label}>Monto</div>
        <input
          className={styles.textField}
          type="number"
          name="amount"
          placeholder="10000"
          min="1"
          step="1"
        />
      </div>

      <button
        type="submit"
        className={styles.payButton}
      >
        Donar
      </button>
    </form>
  );
}
