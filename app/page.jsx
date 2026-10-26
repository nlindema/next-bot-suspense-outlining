import { Suspense } from "react";
import { Items } from "./items";

// ~50 kB of HTML inside the boundary: above React's default progressiveChunkSize (12,800 bytes).
export default function LargePage() {
  return (
    <>
      <h1>Large boundary (500 items)</h1>
      <Suspense fallback={<p id="fallback">Loading…</p>}>
        <Items count={500} />
      </Suspense>
    </>
  );
}
