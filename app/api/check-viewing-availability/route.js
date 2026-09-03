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

    if (!start) {
      return NextResponse.json(
        {
          success: false,
          message: "start is required.",
        },
        { status: 400 }
      );
    }

    const eventTypeId = process.env.CAL_EVENT_TYPE_ID;
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

    const selectedDate = new Date(start);

    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid start datetime.",
        },
        { status: 400 }
      );
    }

    const startTime = selectedDate.toISOString();

    const endDate = new Date(selectedDate.getTime() + 60 * 60 * 1000);

    const endTime = endDate.toISOString();

    const url = new URL("https://api.cal.com/v2/slots");

    url.searchParams.append("eventTypeId", eventTypeId);
    url.searchParams.append("start", startTime);
    url.searchParams.append("end", endTime);
    url.searchParams.append("timeZone", "Asia/Karachi");
    url.searchParams.append("format", "range");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-09-04",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check viewing availability.",
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Viewing availability checked successfully.",
      propertyId: propertyId || null,
      requestedStart: start,
      data,
    });
  } catch (error) {
    console.error("Check viewing availability error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while checking viewing availability.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}