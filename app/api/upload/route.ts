export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_D1_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || "hexescorts-media";
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-aa01e6dca81f482ab084275e93025a99.r2.dev";
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "7dd0399854775e1fb6eacee70f5a1a49";
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "2bfa7f87c5ba92ecc1a243b494c10c28d4d61a4f469bce8629fd82247d02341a";
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// HMAC-SHA256 using WebCrypto (works in both Node.js and Cloudflare Workers)
async function hmacSha256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return toHex(hash);
}

// Sign and upload directly to R2 using AWS SigV4 with WebCrypto
async function uploadToR2(key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, ""); // YYYYMMDDTHHmmssZ

  const host = R2_ENDPOINT.replace("https://", "").replace("http://", "");
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;

  const payloadHash = await sha256Hex(body);
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = `PUT\n/${R2_BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

  // Derive signing key
  const kDate = await hmacSha256(new TextEncoder().encode(`AWS4${R2_SECRET_KEY}`), dateStamp);
  const kRegion = await hmacSha256(kDate, "auto");
  const kService = await hmacSha256(kRegion, "s3");
  const kSigning = await hmacSha256(kService, "aws4_request");
  const signature = toHex(await hmacSha256(kSigning, stringToSign));

  const authHeader = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Host": host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      "Authorization": authHeader,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 upload failed (${res.status}): ${text}`);
  }

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "profile-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const contentType = file.type || "image/jpeg";

    const fileUrl = await uploadToR2(fileName, arrayBuffer, contentType);

    return NextResponse.json({ url: fileUrl, success: true });
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}