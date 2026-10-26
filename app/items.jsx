import { connection } from "next/server";

// Request-time data, already available: no timer, no fetch. The component is dynamic only
// because of connection(), so the boundary is complete as soon as React reaches it.
export async function Items({ count }) {
  await connection();
  return (
    <ul id="items">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          Product {i}: a product description long enough to make each list item about one hundred bytes.
        </li>
      ))}
    </ul>
  );
}
