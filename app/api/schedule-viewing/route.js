import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      start,
      propertyId,
    } = body;

    // Validate required fields
    if (!name || !email || !start) {
      return NextResponse.json(
        {
          success: false,
          message: "name, email, and start are required.",
        },
        { status: 400 }
      );
    }

    const eventTypeId = Number(process.env.CAL_EVENT_TYPE_ID);
    const apiKey = process.env.CAL_API_KEY;

    if (!eventTypeId || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Cal.com configuration is missing.",
        },
        { status: 500 }
      );
    }

    const bookingData = {
      eventTypeId,
      start,
      attendee: {
        name,
        email,
        timeZone: "Asia/Karachi",
        language: "en",
      },
    };

    // Add phone only if provided
    if (phone) {
      bookingData.attendee.phoneNumber = phone;
    }

    // Add property information as booking metadata
    if (propertyId) {
      bookingData.metadata = {
        propertyId,
        purpose: "property viewing",
      };
    }

    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to schedule property viewing.",
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property viewing scheduled successfully.",
      appointment: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while scheduling the viewing.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}