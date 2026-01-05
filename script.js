// script.js

// Data model: cities and nested sites
const projectData = {
  cities: [
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      zoom: 11,
      description: "Key residential and commercial projects in Mumbai.",
      sites: [
        {
          name: "Bandra Site",
          area: "Bandra",
          lat: 19.0596,
          lng: 72.8295,
          details:
            "Premium high‑rise residential tower overlooking the sea."
        },
        {
          name: "Santacruz Site",
          area: "Santacruz",
          lat: 19.0825,
          lng: 72.8417,
          details:
            "Mixed‑use commercial hub near the airport with office and retail."
        },
        {
          name: "Malad Site",
          area: "Malad",
          lat: 19.186,
          lng: 72.848,
          details:
            "IT and business park designed for flexible office layouts."
        }
      ]
    },
    {
      name: "Bengaluru",
      lat: 12.9716,
      lng: 77.5946,
      zoom: 11,
      description: "Technology‑focused office and residential campuses.",
      sites: [
        {
          name: "Whitefield Campus",
          area: "Whitefield",
          lat: 12.9698,
          lng: 77.7499,
          details:
            "Large tech campus with green open spaces and shared amenities."
        },
        {
          name: "Electronic City Towers",
          area: "Electronic City",
          lat: 12.8452,
          lng: 77.6602,
          details:
            "Grade‑A office towers for IT and startup ecosystems."
        }
      ]
    },
    {
      name: "Pune",
      lat: 18.5204,
      lng: 73.8567,
      zoom: 11,
      description: "IT and residential developments in Pune.",
      sites: [
        {
          name: "Hinjawadi Tech Park",
          area: "Hinjawadi",
          lat: 18.597,
          lng: 73.706,
          details:
            "Multi‑phase technology park with modern infrastructure."
        }
      ]
    }
  ]
};

const infoTitle = document.getElementById("info-title");
const infoContent = document.getElementById("info-content");

// 1. Initialize map centered on India
const map = L.map("map", {
  zoomControl: false
}).setView([22.9734, 78.6569], 5); // India center

L.control.zoom({ position: "bottomright" }).addTo(map);

// Dark‑tinted OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// 2. City and site markers
const siteMarkers = {};

function showCity(city) {
  infoTitle.textContent = city.name;
  let html = `<p><strong>${city.description}</strong></p><ul>`;
  city.sites.forEach((site, index) => {
    html += `
      <li class="site-item" data-city="${city.name}" data-site-index="${index}">
        ${site.name} – ${site.area}
      </li>`;
  });
  html += "</ul><p>Click a site name above to view details.</p>";
  infoContent.innerHTML = html;

  // Attach click handlers to site list items
  infoContent.querySelectorAll(".site-item").forEach((item) => {
    item.addEventListener("click", () => {
      const cityName = item.getAttribute("data-city");
      const idx = parseInt(item.getAttribute("data-site-index"), 10);
      const c = projectData.cities.find((c) => c.name === cityName);
      if (!c) return;
      const site = c.sites[idx];
      showSite(c, site);
      const marker = siteMarkers[cityName][idx];
      if (marker) {
        map.setView(marker.getLatLng(), Math.max(city.zoom + 1, 12), {
          animate: true
        });
        marker.openPopup();
      }
    });
  });
}

function showSite(city, site) {
  infoTitle.textContent = site.name;
  infoContent.innerHTML = `
    <p><strong>${site.area}, ${city.name}</strong></p>
    <p>${site.details}</p>
    <button id="back-to-city">Back to ${city.name}</button>
  `;
  document
    .getElementById("back-to-city")
    .addEventListener("click", () => showCity(city));
}

// Create markers
projectData.cities.forEach((city) => {
  // City marker (larger circle marker)
  const cityMarker = L.circleMarker([city.lat, city.lng], {
    radius: 9,
    color: "#000000",
    weight: 2,
    fillColor: "#16a34a",
    fillOpacity: 0.9
  }).addTo(map);

  cityMarker.bindTooltip(city.name, { direction: "top" });

  cityMarker.on("click", () => {
    map.setView([city.lat, city.lng], city.zoom, { animate: true });
    showCity(city);
  });

  // Site markers
  siteMarkers[city.name] = [];
  city.sites.forEach((site) => {
    const marker = L.circleMarker([site.lat, site.lng], {
      radius: 6,
      color: "#000000",
      weight: 1.5,
      fillColor: "#22c55e",
      fillOpacity: 0.95,
      className: "site-marker"
    }).addTo(map);

    marker.bindPopup(`<strong>${site.name}</strong><br>${site.area}, ${city.name}`);

    marker.on("click", () => {
      map.setView([site.lat, site.lng], Math.max(city.zoom + 1, 12), {
        animate: true
      });
      showSite(city, site);
    });

    siteMarkers[city.name].push(marker);
  });
});

// Fit bounds to India projects
const allLatLngs = [];
projectData.cities.forEach((city) => {
  allLatLngs.push([city.lat, city.lng]);
  city.sites.forEach((site) => allLatLngs.push([site.lat, site.lng]));
});
const bounds = L.latLngBounds(allLatLngs);
map.fitBounds(bounds, { padding: [30, 30] });
