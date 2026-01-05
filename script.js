// script.js – map, project routing, contact form

// High-level project detail data for dedicated page
const projectDetails = {
  "mumbai-malad-projects": {
    name: "Malad Projects",
    city: "Mumbai",
    area: "Malad (West)",
    type: "Residential & Commercial",
    status: "Representative example project",
    areaSize: "Mid-rise and mixed-use developments",
    image: "images/malad-sample.jpg",
    description:
      "Representative cluster of residential and commercial developments in and around Ajay Apartment, Malad (West), showcasing Paramount's role in execution, coordination and project monitoring."
  },
  "mumbai-western-suburbs-works": {
    name: "Western Suburbs Works",
    city: "Mumbai",
    area: "Bandra – Andheri belt",
    type: "Residential / Interior Works",
    status: "Representative example project",
    areaSize: "Premium high-street and residential pockets",
    image: "images/western-suburbs-sample.jpg",
    description:
      "Illustrative engagements across the Bandra–Andheri corridor where Paramount has supported civil works, interiors and project monitoring for premium residential and mixed-use assets."
  },
  "western-india-hospitality": {
    name: "Hospitality Engagements",
    city: "Western India",
    area: "Maharashtra",
    type: "Hospitality",
    status: "Representative example project",
    areaSize: "Hotels and serviced apartments",
    image: "images/hospitality-sample.jpg",
    description:
      "Sample hospitality projects across Maharashtra where Paramount provided project management and business services for hotel and serviced apartment developments."
  },
  "western-india-retail-institutional": {
    name: "Retail & Institutional",
    city: "Western India",
    area: "Regional",
    type: "Retail & Institutional",
    status: "Representative example project",
    areaSize: "Retail and institutional footprints",
    image: "images/retail-sample.jpg",
    description:
      "Illustrative retail and institutional spaces across Western India for which Paramount contributed advisory, engineering inputs and rollout support."
  }
};

// Map-visible city + site data
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

// Initialise Leaflet map (only if map element exists)
let map;
const mapElement = document.getElementById("map");
if (mapElement) {
  map = L.map("map", {
    zoomControl: false,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,
    inertia: true,
    inertiaDeceleration: 2000
  }).setView([22.9734, 78.6569], 5);

  L.control
    .zoom({
      position: "bottomright"
    })
    .addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
}

const siteMarkers = {};

function renderCityList() {
  if (!cityListEl) return;
  cityListEl.innerHTML = "";
  projectData.cities.forEach((city, cityIndex) => {
    const li = document.createElement("li");
    li.className = "city-item";
    li.textContent = `${city.name} – view details`;
    li.dataset.cityIndex = cityIndex.toString();
    li.addEventListener("click", () => {
      if (map) {
        map.setView([city.lat, city.lng], city.zoom, { animate: true });
      }
      showCity(city);
    });
    cityListEl.appendChild(li);
  });
}

function openProjectDetail(projectId) {
  window.location.href = `projects.html?id=${encodeURIComponent(projectId)}`;
}

function projectIdFor(cityName, siteName) {
  if (cityName === "Mumbai" && siteName === "Malad Projects") {
    return "mumbai-malad-projects";
  }
  if (cityName === "Mumbai" && siteName === "Western Suburbs Works") {
    return "mumbai-western-suburbs-works";
  }
  if (cityName === "Western India" && siteName === "Hospitality Engagements") {
    return "western-india-hospitality";
  }
  if (
    cityName === "Western India" &&
    siteName === "Retail & Institutional"
  ) {
    return "western-india-retail-institutional";
  }
  return "";
}

function showCity(city) {
  if (!infoTitle || !infoContent) return;

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
      const marker =
        siteMarkers[cityName || ""] &&
        siteMarkers[cityName || ""][index];
      if (marker && map) {
        map.setView(marker.getLatLng(), Math.max(city.zoom + 1, 12), {
          animate: true
        });
        marker.openPopup();
      }

      const pid = projectIdFor(c.name, site.name);
      if (pid) openProjectDetail(pid);
    });
  });
}

function showSite(city, site) {
  if (!infoTitle || !infoContent) return;
  infoTitle.textContent = site.name;
  infoContent.innerHTML = `<p><strong>${site.area}, ${city.name}</strong></p><p>${site.details}</p>`;
}

const backBtn = document.getElementById("back-to-city");
if (backBtn) {
  backBtn.addEventListener("click", () => showCity(projectData.cities[0]));
}

// Create markers only if map exists
if (map) {
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

      marker.on("click", () => {
        showSite(city, site);
        const pid = projectIdFor(city.name, site.name);
        if (pid) openProjectDetail(pid);
      });

      siteMarkers[city.name].push(marker);
    });
  });
}

// Initial UI (only when on index page)
if (map) {
  renderCityList();
  showCity(projectData.cities[0]);
}

// Inject current year
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// Simple alert after form submission (Formspree)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function () {
    setTimeout(() => {
      alert("Thank you. Your enquiry has been submitted.");
    }, 400);
  });
}

// Populate project detail page
(function () {
  const container = document.getElementById("project-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const project = id ? projectDetails[id] : null;

  if (!project) {
    container.innerHTML =
      "<p>Project details not found. Please return to the projects overview.</p>";
    return;
  }

  const imgHtml = project.image
    ? `<img src="${project.image}" alt="${project.name}" class="project-image" />`
    : "";

  container.innerHTML = `
    <article class="project-detail-main">
      <h3>${project.name}</h3>
      ${imgHtml}
      <p>${project.description}</p>
    </article>
    <aside class="project-detail-sidebar">
      <h3>Key Metrics</h3>
      <ul class="project-metrics">
        <li><strong>City:</strong> ${project.city}</li>
        <li><strong>Area / Corridor:</strong> ${project.area}</li>
        <li><strong>Type:</strong> ${project.type}</li>
        <li><strong>Status:</strong> ${project.status}</li>
        <li><strong>Scale:</strong> ${project.areaSize}</li>
      </ul>
    </aside>
  `;
})();
