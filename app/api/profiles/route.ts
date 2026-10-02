export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || "9914bf44-9661-4a24-903f-d49c73d6b1fe";
const D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN;

const toBit = (v: any) => (v === true || v === 1 || v === "1" || v === "true" ? 1 : 0);

async function executeD1Query(sql: string, params: any[] = []) {
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

export async function GET() {
  try {
    const results = await executeD1Query("SELECT * FROM profiles WHERE is_archived = 0 ORDER BY is_pinned DESC, created_at DESC;");
    const dbProfiles = results.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      age: p.age ?? undefined,
      height: p.height ?? undefined,
      bodyType: p.body_type ?? undefined,
      complexion: p.complexion ?? undefined,
      location: p.location,
      rating: Number(p.rating) || 4.5,
      profileImage: p.profile_image || "/placeholder.svg",
      images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []),
      videos: typeof p.videos === "string" ? JSON.parse(p.videos) : (p.videos || []),
      shortBio: p.short_bio || "",
      description: p.description || "",
      phone: p.phone ?? undefined,
      whatsapp: p.whatsapp ?? undefined,
      email: p.email ?? undefined,
      instagram: p.instagram ?? undefined,
      services: typeof p.services === "string" ? JSON.parse(p.services) : (p.services || []),
      isPinned: Boolean(p.is_pinned),
      isArchived: Boolean(p.is_archived),
      isVip: Boolean(p.is_vip),
      isPremium: Boolean(p.is_premium),
      isAd: Boolean(p.is_ad),
      isVerified: Boolean(p.is_verified),
      adImages: typeof p.ad_images === "string" ? JSON.parse(p.ad_images) : (p.ad_images || []),
    }));
    return NextResponse.json(dbProfiles, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch profiles from D1" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || `prof-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const sql = `
      INSERT INTO profiles (
        id, name, age, height, body_type, complexion, location, rating,
        profile_image, images, videos, short_bio, description, phone, whatsapp,
        email, instagram, services, is_pinned, is_archived, is_vip, is_premium,
        is_ad, is_verified, ad_images, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        age = excluded.age,
        height = excluded.height,
        body_type = excluded.body_type,
        complexion = excluded.complexion,
        location = excluded.location,
        rating = excluded.rating,
        profile_image = excluded.profile_image,
        images = excluded.images,
        videos = excluded.videos,
        short_bio = excluded.short_bio,
        description = excluded.description,
        phone = excluded.phone,
        whatsapp = excluded.whatsapp,
        email = excluded.email,
        instagram = excluded.instagram,
        services = excluded.services,
        is_pinned = excluded.is_pinned,
        is_archived = excluded.is_archived,
        is_vip = excluded.is_vip,
        is_premium = excluded.is_premium,
        is_ad = excluded.is_ad,
        is_verified = excluded.is_verified,
        ad_images = excluded.ad_images;
    `;

    const params = [
      id,
      body.name || "Anonymous",
      body.age ? Number(body.age) : null,
      body.height || body.height_type || null,
      body.body_type || body.bodyType || null,
      body.complexion || null,
      body.location || "Kampala",
      body.rating ? Number(body.rating) : 4.5,
      body.profile_image || body.profileImage || "/placeholder.svg",
      JSON.stringify(body.images || []),
      JSON.stringify(body.videos || []),
      body.short_bio || body.shortBio || "",
      body.description || "",
      body.phone || null,
      body.whatsapp || body.phone || null,
      body.email || null,
      body.instagram || null,
      toBit(body.is_pinned ?? body.isPinned),
      toBit(body.is_archived ?? body.isArchived),
      toBit(body.is_vip ?? body.isVip),
      toBit(body.is_premium ?? body.isPremium),
      toBit(body.is_ad ?? body.isAd),
      toBit(body.is_verified ?? body.isVerified),
      JSON.stringify(body.ad_images || body.adImages || []),
    ];

    await executeD1Query(sql, params);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save profile to D1" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, field, value } = await req.json();
    if (!id || !field) {
      return NextResponse.json({ error: "Missing id or field" }, { status: 400 });
    }

    const validFields: Record<string, string> = {
      is_pinned: "is_pinned",
      isPinned: "is_pinned",
      is_archived: "is_archived",
      isArchived: "is_archived",
      is_vip: "is_vip",
      isVip: "is_vip",
      is_verified: "is_verified",
      isVerified: "is_verified",
      is_ad: "is_ad",
      isAd: "is_ad",
    };

    const dbField = validFields[field];
    if (!dbField) {
      return NextResponse.json({ error: "Invalid toggle field" }, { status: 400 });
    }

    const sql = `UPDATE profiles SET ${dbField} = ? WHERE id = ?;`;
    const params = [value ? 1 : 0, id];

    await executeD1Query(sql, params);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update profile" }, { status: 500 });
  }
}