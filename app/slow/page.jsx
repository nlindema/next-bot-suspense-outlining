import { Suspense } from "react";
import { connection } from "next/server";
import { Items } from "../items";

// Stands in for a data fetch: the boundary completes 300 ms after the shell is ready.
async function SlowItems({ count }) {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 300));
  return <Items count={count} />;
}

// ~5 kB of HTML inside the boundary, as on /small/, but not ready when the shell is.
export default function SlowPage() {
  return (
    <>
      <h1>Slow boundary (50 items, 300 ms)</h1>
      <Suspense fallback={<p id="fallback">Loading…</p>}>
        <SlowItems count={50} />
      </Suspense>
    </>
  );
}
