import dbConnect from "@/lib/mongoose";
import Vehicle from "@/lib/modals/Vehicle";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const gmail = session.user.email;
    const username = session.user.name || gmail.split("@")[0];

    let existing = await Vehicle.findOne({ "user.gmail": gmail });

    if (existing) {
      existing.set({
        ...body,                  // <-- update all form fields
        user: {
          gmail,
          username,
          status: "enabled",      // once they submit, status is enabled
        },
      });
      await existing.save();

      return new Response(
        JSON.stringify({ message: "Updated user with vehicle details", data: existing }),
        { status: 200 }
      );
    } else {
      const newVehicle = await Vehicle.create({
        ...body, 
        user: {
          gmail,
          username,
          status: "disabled",
        },
      });

      return new Response(
        JSON.stringify({ message: "Created new user vehicle details", data: newVehicle }),
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("❌ Error in vehicle API:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}