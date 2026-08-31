import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          message: "startTime and endTime are required.",
        },
        { status: 400 }
      );
    }

    const eventTypeId = process.env.CAL_EVENT_TYPE_ID;
    const apiKey = process.env.CAL_API_KEY;

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
          message: "Failed to fetch available viewing slots.",
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Available viewing slots retrieved successfully.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while checking availability.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}