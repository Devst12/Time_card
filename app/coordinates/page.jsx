"use client"
import { useState, useMemo, useCallback } from "react"
import { GoogleMap, useJsApiLoader, MarkerF, TrafficLayer } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// You will need to get a Google Maps API Key from the Google Cloud Console
// and add it to your environment variables (e.g., .env.local).
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

export default function CoordinatesPage() {
  const [coords, setCoords] = useState([])
  const [name, setName] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [showTraffic, setShowTraffic] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapContainerStyle = useMemo(() => ({
    height: "100%",
    width: "100%",
  }), []);

  const center = useMemo(() => ({
    lat: 0,
    lng: 0,
  }), []);

  const addCoordinate = () => {
    if (!name || !latitude || !longitude) return
    const newCoord = {
      id: Date.now(),
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }
    setCoords((prev) => [...prev, newCoord])
    setName("")
    setLatitude("")
    setLongitude("")
  }

  const removeCoordinate = (id) => {
    setCoords((prev) => prev.filter((c) => c.id !== id))
  }

  if (loadError) {
    return <div>Error loading Google Maps. Check your API key.</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-6 bg-gray-50 mt-12">
      {/* Left Panel: Form & List */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Add Coordinates</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Latitude" type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          <Input placeholder="Longitude" type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          <Button onClick={addCoordinate}>Add</Button>
        </div>

        {coords.length === 0 && <p className="text-gray-500 mt-2">No coordinates added yet.</p>}

        <div className="flex flex-col gap-2 mt-4">
          {coords.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-white border rounded-md">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">Lat: {c.latitude}, Lng: {c.longitude}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => removeCoordinate(c.id)} className="flex items-center gap-1">
                <X className="h-4 w-4" /> Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Google Map */}
      <div className="flex-1 h-[500px] md:h-auto rounded-md overflow-hidden shadow-lg relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={2}
        >
          {/* Toggle Traffic Layer */}
          {showTraffic && <TrafficLayer />}

          {/* Markers for added coordinates */}
          {coords.map((c) => (
            <MarkerF
              key={c.id}
              position={{ lat: c.latitude, lng: c.longitude }}
              title={c.name}
            />
          ))}
        </GoogleMap>
        
        {/* Traffic Toggle Switch */}
        <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-md shadow-md flex items-center gap-2">
          <Switch 
            id="traffic-mode" 
            checked={showTraffic} 
            onCheckedChange={setShowTraffic} 
          />
          <Label htmlFor="traffic-mode">Show Traffic</Label>
        </div>
      </div>
    </div>
  )
}