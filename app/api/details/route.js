// app/api/details/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import Vehicle from "@/lib/modals/Vehicle";
import connectDB from "@/lib/mongoose";

export async function GET(req) {
  try {
    // 1. Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const gmail = session.user.email;

    // 2. Connect DB
    await connectDB();

    // 3. Fetch vehicle details using gmail
    const vehicle = await Vehicle.findOne({ "user.gmail": gmail });

    if (!vehicle) {
      return new Response(
        JSON.stringify({ error: "No vehicle found for this Gmail" }),
        { status: 404 }
      );
    }

    // 4. Return vehicle details
    return new Response(JSON.stringify(vehicle), { status: 200 });
  } catch (error) {
    console.error("Vehicle API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
