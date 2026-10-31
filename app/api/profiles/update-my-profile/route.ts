export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";

export async function POST(req: Request) {
  try {
    const { profileId, passcode, updates } = await req.json();

    if (!profileId || !passcode) {
      return NextResponse.json(
        { success: false, error: "Profile ID and passcode are required." },
        { status: 400 }
      );
    }

    const cleanPasscode = String(passcode).trim();

    // Verify passcode against D1
    const rows = await executeD1Query(
      "SELECT id, passcode FROM profiles WHERE id = ? LIMIT 1;",
      [profileId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profile not found." },
        { status: 404 }
      );
    }

    const currentProfile = rows[0];
    if (String(currentProfile.passcode || "").trim() !== cleanPasscode) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Incorrect passcode." },
        { status: 403 }
      );
    }

    // Apply allowed profile updates
    const newPasscode = updates.newPasscode ? String(updates.newPasscode).trim() : cleanPasscode;

    const sql = `
      UPDATE profiles SET
        name = COALESCE(?, name),
        age = COALESCE(?, age),
        height = COALESCE(?, height),
        body_type = COALESCE(?, body_type),
        complexion = COALESCE(?, complexion),
        location = COALESCE(?, location),
        profile_image = COALESCE(?, profile_image),
        images = COALESCE(?, images),
        videos = COALESCE(?, videos),
        short_bio = COALESCE(?, short_bio),
        description = COALESCE(?, description),
        phone = COALESCE(?, phone),
        whatsapp = COALESCE(?, whatsapp),
        services = COALESCE(?, services),
        passcode = ?
      WHERE id = ?;
    `;

    const params = [
      updates.name?.trim() || null,
      updates.age ? Number(updates.age) : null,
      updates.height || null,
      updates.body_type || updates.bodyType || null,
      updates.complexion || null,
      updates.location?.trim() || null,
      updates.profile_image || updates.profileImage || null,
      updates.images ? JSON.stringify(updates.images) : null,
      updates.videos ? JSON.stringify(updates.videos) : null,
      updates.short_bio ?? updates.shortBio ?? null,
      updates.description ?? null,
      updates.phone?.trim() || null,
      updates.whatsapp?.trim() || updates.phone?.trim() || null,
      updates.services ? JSON.stringify(updates.services) : null,
      newPasscode,
      profileId,
    ];

    await executeD1Query(sql, params);

    return NextResponse.json({
      success: true,
      newPasscode,
      message: "Profile updated successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
