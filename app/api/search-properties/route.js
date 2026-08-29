import { NextResponse } from "next/server";
import properties from "../../../data/properties.json";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      purpose,
      location,
      budget,
      bedrooms,
      preferences
    } = body;

    let results = properties;

    // Buy / Rent filter
    if (purpose) {
      results = results.filter(
        (property) =>
          property.purpose.toLowerCase() === purpose.toLowerCase()
      );
    }

    // Location filter
    if (location) {
      const searchLocation = location.toLowerCase().trim();

      results = results.filter((property) =>
        property.location.toLowerCase().includes(searchLocation)
      );
    }

    // Budget filter
    if (budget) {
      const maxBudget = Number(budget);

      results = results.filter(
        (property) => property.budget <= maxBudget
      );
    }

    // Bedrooms filter
    if (bedrooms) {
      const requestedBedrooms = Number(bedrooms);

      results = results.filter(
        (property) => property.bedrooms >= requestedBedrooms
      );
    }

    // Preferences filter
    if (preferences) {
      let requestedPreferences = [];

      if (Array.isArray(preferences)) {
        requestedPreferences = preferences;
      } else {
        requestedPreferences = preferences.split(",");
      }

      requestedPreferences = requestedPreferences
        .map((preference) => preference.trim().toLowerCase())
        .filter(Boolean);

      results = results.filter((property) =>
        requestedPreferences.every((preference) =>
          property.features.some(
            (feature) =>
              feature.toLowerCase().trim() === preference
          )
        )
      );
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      properties: results
    });
  } catch (error) {
    console.error("Search properties error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to search properties."
      },
      { status: 500 }
    );
  }
}