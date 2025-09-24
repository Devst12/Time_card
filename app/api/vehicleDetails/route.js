import dbConnect from "@/lib/mongoose";
import VehicleDetails from "@/lib/modals/VehicleDetails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

async function getSessionEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email || null;
}

export async function PUT(req) {
  await dbConnect();
  const email = await getSessionEmail();
  if (!email) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const body = await req.json();
  const { id, action, payload } = body; 
  // action tells what to do: e.g. "updateDriver", "addRoute", "removeRoute", etc.

  try {
    let updated;

    switch (action) {
      case "updateDriver":
        // payload: { driverId, updates }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, "drivers._id": payload.driverId, userGmail: email },
          { $set: { "drivers.$": payload.updates } }, 
          { new: true }
        );
        break;

      case "addDriver":
        // payload: { driverObject }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $push: { drivers: payload.driverObject } },
          { new: true }
        );
        break;

      case "removeDriver":
        // payload: { driverId }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $pull: { drivers: { _id: payload.driverId } } },
          { new: true }
        );
        break;

      case "addRoute":
        // payload: { routeObject }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $push: { routes: payload.routeObject } },
          { new: true }
        );
        break;

      case "removeRoute":
        // payload: { routeId }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $pull: { routes: { _id: payload.routeId } } },
          { new: true }
        );
        break;

      case "updateVehicleInfo":
        // payload: { name?, number?, capacity? }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $set: { "vehicle": payload } },
          { new: true }
        );
        break;

      case "addVehicleImage":
        // payload: { url }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $push: { "vehicle.images": payload.url } },
          { new: true }
        );
        break;

      case "removeVehicleImage":
        // payload: { url }
        updated = await VehicleDetails.findOneAndUpdate(
          { _id: id, userGmail: email },
          { $pull: { "vehicle.images": payload.url } },
          { new: true }
        );
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    if (!updated) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("Partial PUT error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}