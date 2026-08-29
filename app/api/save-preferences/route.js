import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      purpose,
      location,
      budget,
      bedrooms,
      preferences,
      moveDate,
    } = body;

    if (
      !name ||
      !email ||
      !purpose ||
      !location ||
      !budget ||
      !bedrooms ||
      !preferences ||
      !moveDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required preference information.",
        },
        { status: 400 }
      );
    }

    const savedPreferences = {
      preferenceId: `PREF-${Date.now()}`,
      name,
      email,
      purpose,
      location,
      budget,
      bedrooms,
      preferences,
      moveDate,
      savedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Customer preferences saved successfully.",
      preferences: savedPreferences,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save customer preferences.",
      },
      { status: 500 }
    );
  }
}