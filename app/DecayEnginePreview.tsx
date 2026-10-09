"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./DecayEngine.module.css";

export default function DecayEnginePreview() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className={styles.preview}>
      <button
        type="button"
        className={styles.previewButton}
        aria-label="Enlarge the DECAY ENGINE plugin interface"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Image
          src="/decay-engine-interface.webp?v=044ce44ee95b"
          width={1596}
          height={1198}
          alt="DECAY ENGINE interface showing Weight, Damage, Memory, and Distance macros alongside Pressure, Dirt, Decay, Drift, Void, and Ghost processing controls."
          unoptimized
        />
      </button>
      <figcaption>DECAY ENGINE / V1 / PLUGIN INTERFACE</figcaption>
      <dialog
        ref={dialogRef}
        className={styles.previewDialog}
        aria-label="DECAY ENGINE interface preview"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <form method="dialog" className={styles.previewClose}>
          <button type="submit" autoFocus>Close preview</button>
        </form>
        <Image
          src="/decay-engine-interface.webp?v=044ce44ee95b"
          width={1596}
          height={1198}
          alt="Full DECAY ENGINE v1 plugin interface."
          unoptimized
        />
        <a href="/decay-engine-interface.webp?v=044ce44ee95b" target="_blank" rel="noreferrer">Open full-size image</a>
      </dialog>
    </figure>
  );
}
