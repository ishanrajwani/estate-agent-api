import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

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

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          purpose,
          location,
          budget: Number(budget),
          bedrooms: Number(bedrooms),
          preferences,
          move_date: moveDate,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase save preferences error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to save customer preferences.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer preferences saved successfully.",
      preferences: data,
    });
  } catch (error) {
    console.error("Save preferences error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save customer preferences.",
      },
      { status: 500 }
    );
  }
}