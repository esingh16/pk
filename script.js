// script.js

// 1. Project data structure
const projectData = {
  cities: [
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      zoom: 11,
      description: "Key commercial projects in Mumbai region.",
      sites: [
        {
          name: "Bandra Site",
          area: "Bandra",
          lat: 19.0596,
          lng: 72.8295,
          details:
            "High‑rise residential tower with modern amenities in Bandra."
        },
        {
          name: "Santacruz Site",
          area: "Santacruz",
          lat: 19.0825,
          lng: 72.8417,
          details:
            "Premium mixed‑use development close to Santacruz station."
        },
        {
          name: "Malad Site",
          area: "Malad",
          lat: 19.186,
          lng: 72.848,
          details:
            "IT park and commercial complex in Malad West."
        }
      ]
    },
    {
      name: "Bengaluru",
      lat: 12.9716,
      lng: 77.5946,
      zoom: 11,
      description: "Technology and residential projects in Bengaluru.",
      sites: [
        {
          name: "Whitefield Campus",
          area: "Whitefield",
          lat: 12.9698,
          lng: 77.7499,
          details: "Large tech campus with multiple office blocks."
        },
        {
          name: "Electronic City Towers",
          area: "Electronic City",
          lat: 12.8452,
          lng: 77.6602,
          details: "High‑density office space for IT companies."
        }
      ]
    },
    {
      name: "Pune",
      lat: 18.5204,
      lng: 73.8567,
      zoom: 11,
      description: "Industrial and residential developments in Pune.",
      sites: [
        {
          name: "Hinjawadi Tech Park",
          area: "Hinjawadi",
          lat: 18.597,
          lng: 73.706,
          details: "IT park with multiple phases and SEZ status."
        }
      ]
    }
  ]
};

// 2. Initialize map centered on India
const map = L.map("map").setView([22.9734, 78.6569], 5); // India center

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// For nested markers, keep references
const cityMarkers = {};
const siteMarkers = {}; // keyed by city name -> array of markers

// Utility: update info panel
function showCityInfo(city) {
  const titleEl = document.getElementById("info-title");
  const contentEl = document.getElementById("info-content");

  titleEl.textContent = city.name;
  let html = `<p class="city-title">${city.description}</p>`;

  if (city.sites && city.sites.length) {
    html += "<ul>";
    city.sites.forEach((site) => {
      html += `<li><strong>${site.name}</strong> – ${site.area}</li>`;
    });
    html += "</ul>";
  }

  contentEl.innerHTML = html;
}

function showSiteInfo(city, site) {
  const titleEl = document.getElementById("info-title");
  const contentEl = document.getElementById("info-content");

  titleEl.textContent = site.name;
  contentEl.innerHTML = `
    <p class="site-title">${site.area}, ${city.name}</p>
    <p>${site.details}</p>
  `;
}

// 3. Add city markers and nested site markers
projectData.cities.forEach((city) => {
  // City marker
  const cityMarker = L.marker([city.lat, city.lng], {
    title: city.name
  }).addTo(map);

  cityMarkers[city.name] = cityMarker;
  siteMarkers[city.name] = [];

  cityMarker.bindTooltip(city.name);

  cityMarker.on("click", () => {
    // Zoom into city
    map.setView([city.lat, city.lng], city.zoom, { animate: true });
    showCityInfo(city);
  });

  // Site markers for that city
  city.sites.forEach((site) => {
    const marker = L.circleMarker([site.lat, site.lng], {
      radius: 6,
      color: "#1f2937",
      fillColor: "#ef4444",
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindTooltip(`${site.name} (${site.area})`);

    marker.on("click", () => {
      // Slight zoom when clicking a specific site
      map.setView([site.lat, site.lng], Math.max(city.zoom + 1, 12), {
        animate: true
      });
      showSiteInfo(city, site);
    });

    siteMarkers[city.name].push(marker);
  });
});

// Optional: fit bounds to all markers
const allLatLngs = [];
projectData.cities.forEach((city) => {
  allLatLngs.push([city.lat, city.lng]);
  city.sites.forEach((site) => {
    allLatLngs.push([site.lat, site.lng]);
  });
});
const bounds = L.latLngBounds(allLatLngs);
map.fitBounds(bounds, { padding: [30, 30] });
