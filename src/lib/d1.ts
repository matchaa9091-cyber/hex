const ACCOUNT_ID = process.env.CLOUDFLARE_D1_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || "9914bf44-9661-4a24-903f-d49c73d6b1fe";
const D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN;

export async function executeD1Query(sql: string, params: any[] = []): Promise<any[]> {
  if (!ACCOUNT_ID || !DB_ID || !D1_TOKEN) {
    throw new Error("Cloudflare D1 credentials missing");
  }
  const D1_URI = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`;
  const res = await fetch(D1_URI, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${D1_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || "D1 Query execution failed");
  }
  return data.result?.[0]?.results || [];
}
