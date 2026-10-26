import { Suspense } from "react";
import { Items } from "../items";

// ~5 kB of HTML inside the boundary: below progressiveChunkSize.
export default function SmallPage() {
  return (
    <>
      <h1>Small boundary (50 items)</h1>
      <Suspense fallback={<p id="fallback">Loading…</p>}>
        <Items count={50} />
      </Suspense>
    </>
  );
}
