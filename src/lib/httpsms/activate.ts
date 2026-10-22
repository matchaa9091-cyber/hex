import { executeD1Query } from "@/lib/d1";

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_D1_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || "hexescorts-media";
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "7dd0399854775e1fb6eacee70f5a1a49";
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "2bfa7f87c5ba92ecc1a243b494c10c28d4d61a4f469bce8629fd82247d02341a";
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const APPLICATIONS_KEY = "data/applications.json";

// SigV4 for R2
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

export async function activateApplication(applicationId: string, paymentDetails: {
  paymentId?: string;
  amount: number;
  transactionId?: string | null;
  phone?: string | null;
  provider?: string | null;
}) {
  // 1. Try to fetch application from R2 first (holds richest json data)
  let app: any = null;
  let allApps: any[] = [];
  try {
    const res = await r2Request("GET", APPLICATIONS_KEY);
    if (res.ok) {
      allApps = await res.json();
      app = allApps.find((a: any) => a.id === applicationId);
    }
  } catch (err) {
    console.error("Error reading application from R2:", err);
  }

  // Fallback: check D1 escort_applications if not in R2
  if (!app) {
    const rows = await executeD1Query("SELECT * FROM escort_applications WHERE id = ?", [applicationId]);
    if (rows && rows.length > 0) {
      app = rows[0];
      if (typeof app.services === "string") {
        try { app.services = JSON.parse(app.services); } catch {}
      }
      if (typeof app.images === "string") {
        try { app.images = JSON.parse(app.images); } catch {}
      }
      if (typeof app.videos === "string") {
        try { app.videos = JSON.parse(app.videos); } catch {}
      }
    }
  }

  if (!app) {
    throw new Error(`Application ${applicationId} not found`);
  }

  const isVip = app.plan === "vip_week" || app.plan === "monthly" || app.plan === "vip" || app.plan === "vip_boost";
  const profileId = app.id.startsWith("prof-") ? app.id : `prof-${app.id.replace(/^app-/, "")}`;

  // 2. Insert into live D1 `profiles` table
  const insertProfileSql = `
    INSERT INTO profiles (
      id, name, age, height, body_type, complexion, location, rating,
      profile_image, images, videos, short_bio, description, phone, whatsapp,
      email, instagram, services, is_pinned, is_archived, is_vip, is_premium,
      is_ad, is_verified, ad_images, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0, 1, '[]', datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      location = excluded.location,
      phone = excluded.phone,
      whatsapp = excluded.whatsapp,
      short_bio = excluded.short_bio,
      profile_image = excluded.profile_image,
      images = excluded.images,
      videos = excluded.videos,
      is_pinned = excluded.is_pinned,
      is_vip = excluded.is_vip,
      is_premium = excluded.is_premium,
      is_verified = 1;
  `;

  const profileParams = [
    profileId,
    app.name || "Anonymous",
    app.age ? Number(app.age) : 22,
    app.height || "5'5\"",
    app.body_type || "Slim",
    app.complexion || "Medium",
    app.location || "Kampala",
    4.8,
    app.profile_image || "/placeholder.svg",
    typeof app.images === "string" ? app.images : JSON.stringify(app.images || []),
    typeof app.videos === "string" ? app.videos : JSON.stringify(app.videos || []),
    app.short_bio || "",
    app.description || "",
    app.phone || "",
    app.whatsapp || app.phone || "",
    app.email || null,
    app.instagram || null,
    typeof app.services === "string" ? app.services : JSON.stringify(app.services || ["Dating", "Companionship"]),
    isVip ? 1 : 0,
    isVip ? 1 : 0,
    isVip ? 1 : 0,
  ];

  await executeD1Query(insertProfileSql, profileParams);

  // 3. Update D1 escort_applications
  await executeD1Query(`
    UPDATE escort_applications 
    SET status = 'approved',
        payment_method = ?,
        payment_phone = ?,
        transaction_id = ?
    WHERE id = ?
  `, [
    paymentDetails.provider || "momo",
    paymentDetails.phone || app.payment_phone || app.phone,
    paymentDetails.transactionId || app.transaction_id || "VERIFIED-HTTPSMS",
    applicationId
  ]);

  // 4. Update R2 applications JSON
  if (allApps.length > 0) {
    const updatedApps = allApps.map((a: any) => {
      if (a.id === applicationId) {
        return {
          ...a,
          status: "approved",
          payment_method: paymentDetails.provider || a.payment_method || "momo",
          payment_phone: paymentDetails.phone || a.payment_phone || a.phone,
          transaction_id: paymentDetails.transactionId || a.transaction_id || "VERIFIED-HTTPSMS",
          verified_amount: paymentDetails.amount,
          verified_at: new Date().toISOString(),
          verified_via: "httpsms",
        };
      }
      return a;
    });
    try {
      const json = JSON.stringify(updatedApps, null, 2);
      const body = new TextEncoder().encode(json).buffer as ArrayBuffer;
      await r2Request("PUT", APPLICATIONS_KEY, body, "application/json");
    } catch (err) {
      console.error("Failed to update R2 applications status:", err);
    }
  }

  // 5. Update httpsms_payments status
  if (paymentDetails.paymentId) {
    await executeD1Query(`
      UPDATE httpsms_payments
      SET status = 'verified', matched_application_id = ?
      WHERE id = ?
    `, [applicationId, paymentDetails.paymentId]);
  }

  return { success: true, profileId, applicationId };
}
