import React, { createContext, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { createRoot } from 'react-dom/client';

let leafletLoadingPromise: Promise<any> | null = null;

// Dynamically load Leaflet assets on runtime to prevent compiling errors in non-web platforms.
const loadLeaflet = (): Promise<any> => {
  if (typeof window === 'undefined') return Promise.reject('Window is undefined');
  if ((window as any).L) return Promise.resolve((window as any).L);
  
  if (leafletLoadingPromise) return leafletLoadingPromise;
  
  leafletLoadingPromise = new Promise((resolve, reject) => {
    // Inject leaflet CSS stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Inject leaflet JS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Inject tactical dark-military styling overrides to maps and panels
      const style = document.createElement('style');
      style.innerHTML = `
        .leaflet-container {
          background-color: #0d0802 !important;
        }
        /* Custom hue matrix to tint standard maps into premium night-vision military HUDs */
        .leaflet-tile-pane {
          filter: sepia(1) hue-rotate(80deg) saturate(3.5) brightness(1.8) contrast(1.4) !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        .custom-leaflet-marker {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(232, 213, 163, 0.2) !important;
          background: none !important;
          box-shadow: none !important;
        }
        .leaflet-bar a {
          background-color: rgba(10, 15, 10, 0.9) !important;
          color: #e8d5a3 !important;
          border-bottom: 1px solid rgba(232, 213, 163, 0.15) !important;
          transition: all 0.2s ease;
        }
        .leaflet-bar a:hover {
          background-color: #e8d5a3 !important;
          color: #0d0802 !important;
        }
      `;
      document.head.appendChild(style);
      resolve((window as any).L);
    };
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
  
  return leafletLoadingPromise;
};

const LeafletMapContext = createContext<{ map: any; L: any } | null>(null);

const MapView = React.forwardRef<any, any>(({
  children,
  style,
  initialRegion,
  initialCamera,
  onMapReady,
  onRegionChangeComplete,
  scrollEnabled = true,
  zoomEnabled = true
}, ref) => {
  const mapId = useRef('map-' + Math.random().toString(36).substring(2, 9)).current;
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [leafletLib, setLeafletLib] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    loadLeaflet().then((L) => {
      setLeafletLib(L);
      
      const centerLat = initialRegion?.latitude || initialCamera?.center?.latitude || 48.8566;
      const centerLng = initialRegion?.longitude || initialCamera?.center?.longitude || 2.3522;
      let zoom = 13;
      
      if (initialRegion?.latitudeDelta) {
        zoom = Math.round(Math.log2(360 / initialRegion.latitudeDelta));
      } else if (initialCamera?.zoom) {
        zoom = initialCamera.zoom;
      }
      
      const map = L.map(mapId, {
        zoomControl: false,
        attributionControl: false,
        dragging: scrollEnabled,
        touchZoom: zoomEnabled,
        scrollWheelZoom: zoomEnabled,
        doubleClickZoom: zoomEnabled,
        boxZoom: zoomEnabled,
      }).setView([centerLat, centerLng], zoom);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);
      
      setMapInstance(map);
      mapRef.current = map;
      
      if (onMapReady) {
        setTimeout(() => {
          map.invalidateSize();
          onMapReady();
        }, 150);
      }
      
      const handleMoveEnd = () => {
        if (!onRegionChangeComplete) return;
        const center = map.getCenter();
        const bounds = map.getBounds();
        const latDelta = Math.abs(bounds.getNorth() - bounds.getSouth());
        const lngDelta = Math.abs(bounds.getEast() - bounds.getWest());
        
        onRegionChangeComplete({
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latDelta || 0.008,
          longitudeDelta: lngDelta || 0.008,
        });
      };
      
      map.on('moveend', handleMoveEnd);
      
      return () => {
        map.off('moveend', handleMoveEnd);
        map.remove();
      };
    }).catch(err => {
      console.error('Failed to initialize Leaflet Map:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    getCamera: () => {
      if (!mapRef.current) return { center: { latitude: 0, longitude: 0 }, zoom: 0, pitch: 0, heading: 0 };
      const center = mapRef.current.getCenter();
      return {
        center: {
          latitude: center.lat,
          longitude: center.lng,
        },
        zoom: mapRef.current.getZoom(),
        pitch: 0,
        heading: 0,
      };
    },
    animateCamera: (camera: any, options?: any) => {
      if (mapRef.current && camera.center) {
        const center = [camera.center.latitude, camera.center.longitude];
        const zoom = camera.zoom || mapRef.current.getZoom();
        mapRef.current.setView(center, zoom);
      }
    },
    animateToRegion: (region: any, duration?: number) => {
      if (mapRef.current && region) {
        const center = [region.latitude, region.longitude];
        const zoom = region.latitudeDelta ? Math.round(Math.log2(360 / region.latitudeDelta)) : mapRef.current.getZoom();
        mapRef.current.setView(center, zoom);
      }
    }
  }));

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <div id={mapId} style={{ width: '100%', height: '100%' }} />
      {mapInstance && leafletLib && (
        <LeafletMapContext.Provider value={{ map: mapInstance, L: leafletLib }}>
          {children}
        </LeafletMapContext.Provider>
      )}
    </View>
  );
});

MapView.displayName = 'MapView';

export const Circle = ({ center, radius, fillColor, strokeColor, strokeWidth }: any) => {
  const context = useContext(LeafletMapContext);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!context || !center) return;
    const { map, L } = context;
    
    let fillOpacity = 0.15;
    if (fillColor && fillColor.includes('rgba')) {
      const parts = fillColor.split(',');
      if (parts.length === 4) {
        fillOpacity = parseFloat(parts[3].replace(')', '').trim());
      }
    }

    const circle = L.circle([center.latitude, center.longitude], {
      radius: radius,
      fillColor: fillColor || '#c0392b',
      fillOpacity: fillOpacity,
      color: strokeColor || '#c0392b',
      weight: strokeWidth || 2,
      interactive: false,
    }).addTo(map);
    
    circleRef.current = circle;
    
    return () => {
      if (circleRef.current) {
        circleRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  useEffect(() => {
    if (circleRef.current && center) {
      circleRef.current.setLatLng([center.latitude, center.longitude]);
    }
  }, [center?.latitude, center?.longitude]);

  useEffect(() => {
    if (circleRef.current && radius) {
      circleRef.current.setRadius(radius);
    }
  }, [radius]);

  return null;
};

export const Marker = ({ coordinate, children, anchor }: any) => {
  const context = useContext(LeafletMapContext);
  const markerRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context || !coordinate) return;
    const { map, L } = context;

    const el = document.createElement('div');
    elRef.current = el;
    
    const root = createRoot(el);
    rootRef.current = root;
    root.render(children);

    const anchorX = anchor ? anchor.x : 0.5;
    const anchorY = anchor ? anchor.y : 0.5;
    
    const marker = L.marker([coordinate.latitude, coordinate.longitude], {
      icon: L.divIcon({
        html: el,
        className: 'custom-leaflet-marker',
        iconSize: [40, 40],
        iconAnchor: [40 * anchorX, 40 * anchorY],
      })
    }).addTo(map);

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      setTimeout(() => {
        if (rootRef.current) {
          rootRef.current.unmount();
        }
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  useEffect(() => {
    if (markerRef.current && coordinate) {
      markerRef.current.setLatLng([coordinate.latitude, coordinate.longitude]);
    }
  }, [coordinate?.latitude, coordinate?.longitude]);

  useEffect(() => {
    if (rootRef.current && children) {
      rootRef.current.render(children);
    }
  }, [children]);

  return null;
};

export default MapView;
