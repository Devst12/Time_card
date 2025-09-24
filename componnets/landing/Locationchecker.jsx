"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, AlertTriangle, Loader2, Settings, Smartphone } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const LocationChecker = () => {
  const [locationStatus, setLocationStatus] = useState("checking");
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLocationError, setShowLocationError] = useState(false);

  useEffect(() => {
    attemptToGetLocation();
  }, []);

  const attemptToGetLocation = () => {
    setIsLoading(true);
    setError("");
    setShowLocationError(false);
    
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      setShowLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location obtained:", latitude, longitude);
        
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationStatus("granted");
        setShowLocationError(false);
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setAddress(data.display_name || "Address not found");
        } catch (err) {
          console.error("Address fetch error:", err);
          setAddress("Unable to fetch address");
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoading(false);
        setShowLocationError(true);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus("denied");
            setError("Location permission was denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus("unavailable");
            setError("Location information is unavailable. Please turn on location services.");
            break;
          case error.TIMEOUT:
            setLocationStatus("timeout");
            setError("Location request timed out. Please check your location settings.");
            break;
          default:
            setLocationStatus("error");
            setError("Unable to access location. Please enable location services.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getDeviceInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    
    if (isAndroid) {
      return {
        device: "Android",
        steps: [
          "Open Settings app",
          "Tap on 'Location' or 'Security & Location'",
          "Turn ON the Location toggle",
          "Set mode to 'High accuracy'",
          "Return to browser and refresh"
        ]
      };
    } else if (isIOS) {
      return {
        device: "iOS",
        steps: [
          "Open Settings app",
          "Tap 'Privacy & Security'",
          "Tap 'Location Services'",
          "Turn ON Location Services",
          "Find your browser and set to 'While Using App'",
          "Return to browser and refresh"
        ]
      };
    } else {
      return {
        device: "Desktop",
        steps: [
          "Click the lock/info icon in address bar",
          "Find 'Location' in permissions",
          "Change to 'Allow'",
          "Refresh the page"
        ]
      };
    }
  };

  const instructions = getDeviceInstructions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Persistent Location Error Popup - No close button */}
      {showLocationError && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-pulse-slow">
            <div className="text-center">
              {/* Alert Icon */}
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location Required
              </h2>
              
              <p className="text-red-600 font-medium mb-4">
                {error}
              </p>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-yellow-700" />
                  <h3 className="font-semibold text-yellow-900">
                    Turn ON Location - {instructions.device}
                  </h3>
                </div>
                
                <ol className="text-left space-y-2 text-sm text-gray-700">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-bold text-yellow-700 mt-0.5">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={attemptToGetLocation}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  I've Enabled Location - Try Again
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Smartphone className="w-4 h-4" />
                  <span>Location must be enabled to continue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Your Current Location
            </h1>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Getting your location...</p>
                <p className="text-sm text-gray-500 mt-2">Please allow location access if prompted</p>
              </div>
            ) : locationStatus === "granted" && userLocation ? (
              <div className="space-y-6">
                {/* Location Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Your current address:</p>
                      <p className="text-gray-900 font-medium">{address}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                  {typeof window !== 'undefined' && (
                    <MapContainer
                      center={[userLocation.lat, userLocation.lng]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-semibold">You are here!</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={attemptToGetLocation}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Update Location
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Waiting for Location Access
                </h3>
                <p className="text-gray-600">
                  Please enable location services to continue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationChecker;