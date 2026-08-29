import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      purpose,
      location,
      budget,
      bedrooms,
      preferences,
      moveDate
    } = body;

    // Required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and phone are required."
        },
        { status: 400 }
      );
    }

    // Create lead
    const lead = {
      id: `LEAD-${Date.now()}`,
      name,
      email,
      phone,
      purpose: purpose || null,
      location: location || null,
      budget: budget ? Number(budget) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      preferences: preferences || null,
      moveDate: moveDate || null,
      createdAt: new Date().toISOString()
    };

    console.log("New property lead:", lead);

    return NextResponse.json({
      success: true,
      message: "Lead created successfully.",
      lead
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create lead."
      },
      { status: 500 }
    );
  }
}