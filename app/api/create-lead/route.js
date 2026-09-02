import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

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
      moveDate,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and phone are required.",
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
          phone,
          purpose: purpose || null,
          location: location || null,
          budget: budget ? Number(budget) : null,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          preferences: preferences || null,
          move_date: moveDate || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase create lead error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to create lead.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead created successfully.",
      lead: data,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create lead.",
      },
      { status: 500 }
    );
  }
}