"use client";
import { donateAction } from "./actions";
import styles from "./form.module.scss";

export function DonationForm() {
  return (
    <form
      className={styles.form}
      action={donateAction}
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
