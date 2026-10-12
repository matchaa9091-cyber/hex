export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_D1_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || "hexescorts-media";
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-aa01e6dca81f482ab084275e93025a99.r2.dev";
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "7dd0399854775e1fb6eacee70f5a1a49";
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "2bfa7f87c5ba92ecc1a243b494c10c28d4d61a4f469bce8629fd82247d02341a";
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const APPLICATIONS_KEY = "data/applications.json";

// ── WebCrypto SigV4 helpers ─────────────────────────────────────────────────
async function hmacSha256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}
function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(data: ArrayBuffer | string) {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return toHex(await crypto.subtle.digest("SHA-256", buf));
}
async function signingKey(secret: string, date: string) {
  const kDate    = await hmacSha256(new TextEncoder().encode(`AWS4${secret}`), date);
  const kRegion  = await hmacSha256(kDate, "auto");
  const kService = await hmacSha256(kRegion, "s3");
  return hmacSha256(kService, "aws4_request");
}

async function r2Request(method: "GET" | "PUT", key: string, body?: ArrayBuffer, contentType = "application/json") {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate   = now.toISOString().replace(/[:\-]|\.\d{3}/g, "");
  const host      = R2_ENDPOINT.replace(/^https?:\/\//, "");
  const url       = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const payloadHash = body ? await sha256Hex(body) : await sha256Hex("");

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders    = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalReq     = `${method}\n/${R2_BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credScope        = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign     = `AWS4-HMAC-SHA256\n${amzDate}\n${credScope}\n${await sha256Hex(canonicalReq)}`;
  const signature        = toHex(await hmacSha256(await signingKey(R2_SECRET_KEY, dateStamp), stringToSign));
  const authHeader       = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${credScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(url, {
    method,
    headers: {
      "Content-Type": contentType,
      "Host": host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      "Authorization": authHeader,
    },
    body: body ?? undefined,
  });
}

// ── R2 JSON helpers ─────────────────────────────────────────────────────────
async function getApplicationsFromR2(): Promise<any[]> {
  try {
    const res = await r2Request("GET", APPLICATIONS_KEY);
    if (!res.ok) return [];
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch {
    return [];
  }
}

async function saveApplicationsToR2(apps: any[]) {
  const json = JSON.stringify(apps, null, 2);
  const body = new TextEncoder().encode(json).buffer as ArrayBuffer;
  const res  = await r2Request("PUT", APPLICATIONS_KEY, body, "application/json");
  if (!res.ok) throw new Error(`Failed to save applications: ${await res.text()}`);
}

// ── Route handlers ──────────────────────────────────────────────────────────
export async function GET() {
  const apps = await getApplicationsFromR2();
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apps = await getApplicationsFromR2();

    const newApp = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name || "Anonymous",
      phone: body.phone || "",
      whatsapp: body.whatsapp || body.phone || "",
      location: body.location || "Kampala",
      age: body.age || 20,
      short_bio: body.short_bio || "",
      description: body.description || "",
      services: body.services || [],
      profile_image: body.profile_image || "",
      images: body.images || [],
      videos: body.videos || [],
      plan: body.plan || "monthly",
      amount: body.amount || 0,
      status: body.status || "pending_payment",
      created_at: new Date().toISOString(),
    };

    await saveApplicationsToR2([newApp, ...apps]);
    return NextResponse.json({ success: true, application: newApp, id: newApp.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save application" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Application ID required" }, { status: 400 });

    const apps    = await getApplicationsFromR2();
    const updated = apps.map((app: any) => (app.id === id ? { ...app, ...updates } : app));
    await saveApplicationsToR2(updated);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update application" }, { status: 500 });
  }
}