import { useEffect, useRef } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';

import {
  TYPE_COLORS,
  createLocationIcon
} from './mapConfig';

function FitMapBounds({ trials }) {
  const map = useMap();

  useEffect(() => {
    if (trials.length === 0) return;

    const bounds = L.latLngBounds(
      trials.map((trial) => [
        trial.纬度,
        trial.经度
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 6
    });
  }, [map, trials]);

  return null;
}

function JourneyMarker({
  group,
  selectedTrial,
  onSelectTrial
}) {
  const markerRef = useRef(null);

  const isSelected = group.trials.some(
    (trial) => trial.编号 === selectedTrial?.编号
  );

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected, selectedTrial]);

  return (
    <Marker
      ref={markerRef}
      position={[group.纬度, group.经度]}
      icon={createLocationIcon(group, isSelected)}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup>
        <div className="journey-popup location-group-popup">
          <span>{group.地点}</span>

          <h3>
            {group.trials.length === 1
              ? `第 ${group.trials[0].编号} 难`
              : `共 ${group.trials.length} 难`}
          </h3>

          <div className="location-trial-list">
            {group.trials.map((trial) => {
              const trialColor =
                TYPE_COLORS[trial.劫难类型] || '#667a73';

              return (
                <button
                  key={trial.编号}
                  type="button"
                  className={
                    selectedTrial?.编号 === trial.编号
                      ? 'location-trial-item location-trial-item--active'
                      : 'location-trial-item'
                  }
                  style={{
                    '--trial-color': trialColor
                  }}
                  onClick={() => onSelectTrial(trial)}
                >
                  <span>第 {trial.编号} 难</span>
                  <strong>{trial.名称}</strong>
                  <small>{trial.劫难类型}</small>
                </button>
              );
            })}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function JourneyMap({
  trials,
  groupedLocations,
  routePositions,
  selectedTrial,
  onSelectTrial
}) {
  return (
    <div className="journey-map-wrapper">
      <MapContainer
        center={[34, 100]}
        zoom={4}
        minZoom={2}
        scrollWheelZoom
        className="journey-leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[34.3416, 108.9398]}
          radius={7}
          pathOptions={{
            color: '#7d2822',
            fillColor: '#a5342c',
            fillOpacity: 1,
            weight: 2
          }}
        >
          <Tooltip
            permanent
            direction="right"
            offset={[8, 0]}
            className="changan-label"
          >
            长安
          </Tooltip>

          <Popup>
            <div className="changan-popup">
              <strong>长安</strong>
              <p>
                唐僧奉唐王之命，从长安启程，踏上西行取经之路。
              </p>
            </div>
          </Popup>
        </CircleMarker>

        <FitMapBounds trials={trials} />

        {routePositions.length >= 2 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#b85a52',
              weight: 3,
              opacity: 0.62,
              dashArray: '8 7'
            }}
          />
        )}

        {groupedLocations.map((group) => (
  <JourneyMarker
    key={`${group.纬度}-${group.经度}`}
    group={group}
    selectedTrial={selectedTrial}
    onSelectTrial={onSelectTrial}
  />
))}
      </MapContainer>

      <div className="journey-map-legend">
        {Object.entries(TYPE_COLORS).map(
          ([type, color]) => (
            <div key={type}>
              <span
                style={{
                  backgroundColor: color
                }}
              />
              {type}
            </div>
          )
        )}
      </div>
    </div>
  );
}