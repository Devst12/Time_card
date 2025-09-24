"use client";
import { useState, useEffect } from "react";
import { uploadImageToImgBB } from "@/lib/config/imgbb";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    routes: [{ from: "", to: "", departureTime: "" }],
    drivers: [{ name: "", age: "", gender: "", contactNumber: "", imageUrl: "" }],
    vehicle: { name: "", number: "", capacity: "", images: [] },
  });

  const fetchVehicles = async () => {
    const res = await fetch("/api/vehicleDetails");
    if (res.ok) setVehicles(await res.json());
  };
  useEffect(() => { fetchVehicles(); }, []);

  // Routes
  const updateRoute = (i, field, value) => {
    const updated = [...form.routes];
    updated[i][field] = value;
    setForm({ ...form, routes: updated });
  };
  const addRoute = () => setForm({ ...form, routes: [...form.routes, { from: "", to: "", departureTime: "" }] });
  const removeRoute = (i) => setForm({ ...form, routes: form.routes.filter((_, idx) => i !== idx) });

  // Drivers
  const updateDriver = (i, field, value) => {
    const updated = [...form.drivers];
    updated[i][field] = value;
    setForm({ ...form, drivers: updated });
  };
  const handleDriverImageUpload = async (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImageToImgBB(file);
    const updated = [...form.drivers];
    updated[i].imageUrl = url;
    setForm({ ...form, drivers: updated });
  };
  const addDriver = () => setForm({ ...form, drivers: [...form.drivers, { name: "", age: "", gender: "", contactNumber: "", imageUrl: "" }] });
  const removeDriver = (i) => setForm({ ...form, drivers: form.drivers.filter((_, idx) => i !== idx) });

  // Vehicle
  const updateVehicle = (field, value) => setForm({ ...form, vehicle: { ...form.vehicle, [field]: value } });
  const handleVehicleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImageToImgBB(file);
    setForm({ ...form, vehicle: { ...form.vehicle, images: [...form.vehicle.images, url] } });
  };
  const removeVehicleImage = (i) => {
    setForm({ ...form, vehicle: { ...form.vehicle, images: form.vehicle.images.filter((_, idx) => i !== idx) } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/vehicleDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchVehicles();
      setForm({ routes:[{from:"",to:"",departureTime:""}],drivers:[{name:"",age:"",gender:"",contactNumber:"",imageUrl:""}],vehicle:{name:"",number:"",capacity:"",images:[]} });
    } else alert("Failed to save");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🚍 Vehicle Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        {/* Routes */}
        <h2 className="text-xl font-semibold text-center">Routes</h2>
        {form.routes.map((r,i)=>(
          <div key={i} className="flex flex-col sm:flex-row gap-2 items-center">
            <input className="border p-2 text-black placeholder-black flex-1" placeholder="From" value={r.from} onChange={(e)=>updateRoute(i,"from",e.target.value)} />
            <input className="border p-2 text-black placeholder-black flex-1" placeholder="To" value={r.to} onChange={(e)=>updateRoute(i,"to",e.target.value)} />
            <input className="border p-2 text-black placeholder-black flex-1" type="time" value={r.departureTime} onChange={(e)=>updateRoute(i,"departureTime",e.target.value)} />
            {form.routes.length>1 && <button type="button" onClick={()=>removeRoute(i)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>}
          </div>
        ))}
        <button type="button" onClick={addRoute} className="bg-gray-200 px-3 py-1 rounded">+ Add Route</button>

        {/* Drivers */}
        <h2 className="text-xl font-semibold text-center">Drivers</h2>
        {form.drivers.map((d,i)=>(
          <div key={i} className="border p-3 rounded space-y-2">
            <input className="border p-2 text-black placeholder-black w-full" placeholder="Driver Name" value={d.name} onChange={(e)=>updateDriver(i,"name",e.target.value)} />
            <select className="border p-2 text-black w-full" value={d.gender} onChange={(e)=>updateDriver(i,"gender",e.target.value)}>
              <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
            <input className="border p-2 text-black w-full" placeholder="Age" type="number" value={d.age} onChange={(e)=>updateDriver(i,"age",e.target.value)} />
            <input className="border p-2 text-black w-full" placeholder="Contact Number" value={d.contactNumber} onChange={(e)=>updateDriver(i,"contactNumber",e.target.value)} />
            {d.imageUrl && <img src={d.imageUrl} alt="Driver" className="w-24 h-24 rounded object-cover" />}
            <input type="file" accept="image/*" onChange={(e)=>handleDriverImageUpload(i,e)} />
            {form.drivers.length>1 && <button type="button" onClick={()=>removeDriver(i)} className="bg-red-500 text-white px-2 py-1 rounded">Remove Driver</button>}
          </div>
        ))}
        <button type="button" onClick={addDriver} className="bg-gray-200 px-3 py-1 rounded">+ Add Driver</button>

        {/* Vehicle */}
        <h2 className="text-xl font-semibold text-center">Vehicle</h2>
        <input className="border p-2 text-black placeholder-black w-full" placeholder="Vehicle Name" value={form.vehicle.name} onChange={(e)=>updateVehicle("name",e.target.value)} />
        <input className="border p-2 text-black placeholder-black w-full" placeholder="Vehicle Number" value={form.vehicle.number} onChange={(e)=>updateVehicle("number",e.target.value)} />
        <input className="border p-2 text-black placeholder-black w-full" placeholder="Capacity" type="number" value={form.vehicle.capacity} onChange={(e)=>updateVehicle("capacity",e.target.value)} />
        <input type="file" accept="image/*" onChange={handleVehicleImageUpload} />
        <div className="flex gap-2 flex-wrap">
          {form.vehicle.images.map((img,i)=>(
            <div key={i} className="relative">
              <img src={img} alt="vehicle" className="w-24 h-24 object-cover rounded" />
              <button type="button" onClick={()=>removeVehicleImage(i)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2">x</button>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Submit</button>
      </form>

      {/* Display Vehicles */}
      <div className="mt-8 space-y-4">
        {vehicles.map(v=>(
          <div key={v._id} className="border p-4 rounded bg-white shadow space-y-2">
            <h2 className="text-lg font-bold text-center">{v.vehicle.name} ({v.vehicle.number})</h2>
            <div className="flex flex-wrap gap-2">
              {v.vehicle.images.map((image,i)=>(
                <img key={i} src={image} className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
            <div><strong>Drivers:</strong> {v.drivers.map((d,i)=>(<div key={i}>{d.name}, {d.gender}, {d.age}<br/></div>))}</div>
            <div><strong>Routes:</strong> {v.routes.map((r,i)=>(<div key={i}>{r.from} → {r.to} at {r.departureTime}</div>))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}