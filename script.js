// script.js – interactive map + city list

// Data model: cities and nested sites
const projectData = {
  cities: [
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      zoom: 11,
      description:
        "Headquartered in Mumbai with residential, commercial and mixed-use developments across Western suburbs.",
      sites: [
        {
          name: "Malad Projects",
          area: "Malad (West)",
          lat: 19.186,
          lng: 72.848,
          details:
            "Residential and commercial developments around Ajay Apartment and neighbouring localities, with full project execution and management support."
        },
        {
          name: "Western Suburbs Works",
          area: "Bandra – Andheri belt",
          lat: 19.1197,
          lng: 72.8468,
          details:
            "Civil works, interiors and project monitoring for premium residential and mixed-use assets."
        }
      ]
    },
    {
      name: "Western India",
      lat: 19.2183,
      lng: 72.9781,
      zoom: 8,
      description:
        "Assignments across Maharashtra and neighbouring states for hospitality, retail and institutional clients.",
      sites: [
        {
          name: "Hospitality Engagements",
          area: "Maharashtra",
          lat: 18.5204,
          lng: 73.8567,
          details:
            "Project and business services support for hotels and serviced apartment developments."
        },
        {
          name: "Retail & Institutional",
          area: "Regional",
          lat: 20.5937,
          lng: 78.9629,
          details:
            "Advisory, engineering inputs and roll-out support for retail and institutional spaces."
        }
      ]
    }
  ]
};

const infoTitle = document.getElementById("info-title");
const infoContent = document.getElementById("info-content");
const cityListEl = document.getElementById("city-list");

// Initialise Leaflet map centered on India
const map = L.map("map", { zoomControl: false }).setView(
  [22.9734, 78.6569],
  5
);
L.control
  .zoom({
    position: "bottomright"
  })
  .addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Markers
const siteMarkers = {};

function renderCityList() {
  cityListEl.innerHTML = "";
  projectData.cities.forEach((city, cityIndex) => {
    const li = document.createElement("li");
    li.className = "city-item";
    li.textContent = `${city.name} – view details`;
    li.dataset.cityIndex = cityIndex.toString();
    li.addEventListener("click", () => {
      map.setView([city.lat, city.lng], city.zoom, { animate: true });
      showCity(city);
    });
    cityListEl.appendChild(li);
  });
}

function showCity(city) {
  infoTitle.textContent = city.name;

  let html = `<p><strong>${city.description}</strong></p>`;
  html += "<p>Select a site below for more information:</p>";
  html += '<ul class="list">';
  city.sites.forEach((site, idx) => {
    html += `<li class="site-item" data-city="${city.name}" data-site-index="${idx}">${site.name} – ${site.area}</li>`;
  });
  html += "</ul>";

  infoContent.innerHTML = html;

  infoContent.querySelectorAll(".site-item").forEach((item) => {
    item.addEventListener("click", () => {
      const cityName = item.getAttribute("data-city");
      const index = parseInt(item.getAttribute("data-site-index") || "0", 10);
      const c = projectData.cities.find((c) => c.name === cityName);
      if (!c) return;
      const site = c.sites[index];
      showSite(c, site);
      const marker = siteMarkers[cityName][index];
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
  infoContent.innerHTML = `<p><strong>${site.area}, ${city.name}</strong></p><p>${site.details}</p>`;
}

document
  .getElementById("back-to-city")
  .addEventListener("click", () => showCity(projectData.cities[0]));

// Create markers
projectData.cities.forEach((city) => {
  const cityMarker = L.circleMarker([city.lat, city.lng], {
    radius: 9,
    color: "#000000",
    weight: 2,
    fillColor: "#34c0c9",
    fillOpacity: 0.9
  }).addTo(map);

  cityMarker.bindTooltip(city.name, { direction: "top" });
  cityMarker.on("click", () => {
    map.setView([city.lat, city.lng], city.zoom, { animate: true });
    showCity(city);
  });

  siteMarkers[city.name] = [];
  city.sites.forEach((site) => {
    const marker = L.circleMarker([site.lat, site.lng], {
      radius: 6,
      color: "#000000",
      weight: 1.5,
      fillColor: "#f7931e",
      fillOpacity: 0.95,
      className: "site-marker"
    }).addTo(map);

    marker.bindPopup(
      `<strong>${site.name}</strong><br>${site.area}, ${city.name}`
    );
    siteMarkers[city.name].push(marker);
  });
});

// Initial UI
renderCityList();
showCity(projectData.cities[0]);

// Inject current year for a more real-time feel
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}
