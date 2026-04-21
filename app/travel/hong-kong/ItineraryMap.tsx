"use client";

import { useEffect, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

type Stop = {
  name: string;
  coords: [number, number];
};

type ItineraryMapProps = {
  color: string;
  stops: Stop[];
};

export default function ItineraryMap({ color, stops }: ItineraryMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      if (!nodeRef.current || mapRef.current || stops.length === 0) return;

      const L = await import("leaflet");
      if (cancelled || !nodeRef.current) return;

      const points = stops.map((stop) => stop.coords as LatLngExpression);
      const map = L.map(nodeRef.current, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: false
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      L.polyline(points, {
        color,
        opacity: 0.88,
        weight: 5,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map);

      stops.forEach((stop, index) => {
        L.circleMarker(stop.coords, {
          radius: index === 0 || index === stops.length - 1 ? 8 : 6,
          fillColor: color,
          fillOpacity: 1,
          color: "#ffffff",
          opacity: 1,
          weight: 3
        })
          .bindTooltip(`${index + 1}. ${stop.name}`, {
            direction: "top",
            offset: [0, -8],
            opacity: 0.92
          })
          .addTo(map);
      });

      map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
      mapRef.current = map;
    }

    renderMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [color, stops]);

  return <div className="route-map" ref={nodeRef} role="img" aria-label="当日路线地图" />;
}
