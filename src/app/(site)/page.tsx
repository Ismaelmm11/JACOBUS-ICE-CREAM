import { Button } from "@/components/ui/Button";
import tx from "@/styles/type.module.css";
import styles from "./page.module.css";

// Provisional hasta el paso 3 (home completa).
export default function HomePage() {
  return (
    <div className={styles.placeholder}>
      <h1 className={tx.heading}>La home llega en el paso 3</h1>
      <p className={tx.body}>Mientras tanto, el header, el ticker, el mega-menú y el footer ya funcionan.</p>
      <Button href="/design" variant="secondary">
        Ver /design
      </Button>
    </div>
  );
}
