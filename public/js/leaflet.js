/* eslint-disable */

export const displayMap = (locations) => {
  const worldBounds = L.latLngBounds([-85.0511, -180], [85.0511, 180]);
  const map = L.map("map", {
    maxBounds: worldBounds,
    maxBoundsViscosity: 1,
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true,
    bounds: worldBounds,
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    const coordinates = [loc.coordinates[1], loc.coordinates[0]];
    points.push(coordinates);

    const popup = document.createElement("p");
    popup.textContent = `Day ${loc.day}: ${loc.description}`;

    L.marker(coordinates, {
      icon: L.icon({
        iconUrl: "/img/pin.png",
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
      }),
    })
      .addTo(map)
      .bindPopup(popup, {
        autoClose: false,
        className: "natours-popup",
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
};
