import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import * as toGeoJSON from "togeojson";

const KMLViewer = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [click, setIsClick] = useState({
    summaryClick: false,
    detailsClick: false,
  });
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(text, "text/xml");
      const geoJson = toGeoJSON.kml(kmlDoc);
      setGeoJsonData(geoJson);
      processKMLData(geoJson);
    };
    reader.readAsText(file);
  };

  const processKMLData = (geoJson) => {
    const summaryData = {};
    const detailsData = {};

    geoJson.features.forEach((feature) => {
      const type = feature.geometry.type;
      summaryData[type] = (summaryData[type] || 0) + 1;

      if (type === "LineString" || type === "MultiLineString") {
        const length = calculateLength(feature.geometry.coordinates);
        detailsData[type] = (detailsData[type] || 0) + length;
      }
    });

    setSummary(summaryData);
    setDetails(detailsData);
  };

  const calculateLength = (coordinates) => {
    let totalLength = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lat1, lon1] = coordinates[i - 1];
      const [lat2, lon2] = coordinates[i];
      const dist = L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2));
      totalLength += dist;
    }
    return totalLength / 1000; // Convert meters to km
  };

  const handleDetails = () => {
    // console.log(JSON.stringify(details, null, 2));
    setIsClick((prev) => ({ ...prev, detailsClick: !prev.detailsClick }));
  };

  const handleSummary = () => {
    // console.log(JSON.stringify(summary, null, 2));
    setIsClick((prev) => ({ ...prev, summaryClick: !prev.summaryClick }));
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".kml"
        onChange={handleFileUpload}
        className="mb-4 border border-1 rounded "
      />

      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSummary}
        >
          Show Summary
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleDetails}
        >
          Show Details
        </button>

        <div className="summary">
          {click.summaryClick && (
            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-2">Summary</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Feature Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary || {}).map(([type, count]) => (
                    <tr key={type}>
                      <td className="border border-gray-300 px-4 py-2">
                        {type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="details">
  {click.detailsClick && (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Details</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Total Length</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(details || {}).map(([type, length]) => (
            <tr key={type}>
              <td className="border border-gray-300 px-4 py-2">{type}</td>
              <td className="border border-gray-300 px-4 py-2">
                {length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

        
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geoJsonData?.features.map((feature, index) => {
          if (feature.geometry.type === "Point") {
            return (
              <Marker
                key={index}
                position={[
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0],
                ]}
              >
                <Popup>{feature.properties.name || "Unnamed Point"}</Popup>
              </Marker>
            );
          }
          if (feature.geometry.type === "LineString") {
            return (
              <Polyline
                key={index}
                positions={feature.geometry.coordinates.map(([lon, lat]) => [
                  lat,
                  lon,
                ])}
                color="blue"
              />
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default KMLViewer;
