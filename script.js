// script.js – map, directory, project detail, contact

// 1. Project directory data
// IMPORTANT: extend this array with ALL rows from Project-details.xlsx
// using the same structure. City and region are normalized manually.
// image filenames must match files in your GitHub repo.
const projectDirectory = [
  {
    id: "2015-BK-JANAKPURI-DELHI",
    year: 2015,
    client: "Burger king",
    brand: "Burger King",
    city: "Delhi",
    region: "North",
    location: "Janakpuri, Delhi",
    image: "BURGER-KING-IMAGE.jpg"
  },
  {
    id: "2018-MCD-VILE-PARLE-MUMBAI",
    year: 2018,
    client: "McDonalds",
    brand: "McDonald’s",
    city: "Mumbai",
    region: "West",
    location: "Vile Parle, Mumbai",
    image: "MCDONALDS-IMAGE.jpg"
  },
  {
    id: "2022-SUBWAY-BANGALORE",
    year: 2022,
    client: "SUBWAY",
    brand: "Subway",
    city: "Bengaluru",
    region: "South",
    location: "Bangalore",
    image: "SUBWAY-IMAGE.jpg"
  },
  {
    id: "2023-CROMA-SOUTH-CITY-KOLKATA",
    year: 2023,
    client: "CROMA",
    brand: "Croma",
    city: "Kolkata",
    region: "East",
    location: "South City, Kolkata",
    image: "CROMA-IMAGE.jpg"
  },
  {
    id: "2023-PEPE-SOUTH-CITY-KOLKATA",
    year: 2023,
    client: "PEPE JEANS",
    brand: "Pepe Jeans",
    city: "Kolkata",
    region: "East",
    location: "South City, Kolkata",
    image: "PEPE-JEANS-IMAGE.jpg"
  },
  {
    id: "2021-IZUMI-JUHU-MUMBAI",
    year: 2021,
    client: "IZUMI",
    brand: "Izumi",
    city: "Mumbai",
    region: "West",
    location: "Juhu, Mumbai",
    image: "IZUMI-IMAGE.jpg"
  },
  {
    id: "2021-TACOBELL-PUNE",
    year: 2021,
    client: "TACO BELL",
    brand: "Taco Bell",
    city: "Pune",
    region: "West",
    location: "Pune",
    image: "TACO-BELL-IMAGE.jpg"
  },
  {
    id: "2018-COPPER-CHIMNEY-DELUXE",
    year: 2018,
    client: "Copper Chimney",
    brand: "Copper Chimney",
    city: "Mumbai",
    region: "West",
    location: "Deluxe Caterers Pvt Ltd (Mumbai)",
    image: "COPPER-CHIMNEY-IMAGE.jpg"
  },
  {
    id: "2023-CHAAYOS-TODI-MILLS",
    year: 2015,
    client: "Chaayos",
    brand: "Chaayos",
    city: "Mumbai",
    region: "West",
    location: "Todi Mills, Lower Parel",
    image: "CHAAYOS-IMAGE.jpg"
  },
  {
    id: "2024-CTR-BANGALORE",
    year: 2024,
    client: "CTR",
    brand: "CTR",
    city: "Bengaluru",
    region: "South",
    location: "Bangalore",
    image: "CTR-IMAGE.jpg"
  },
  {
    id: "2023-YOUMEE-INFINITI-ANDHERI",
    year: 2023,
    client: "LBF",
    brand: "YouMee",
    city: "Mumbai",
    region: "West",
    location: "YouMee, Infiniti Mall, Andheri",
    image: "LBF-IMAGE-2.jpg"
  }
  // TODO: add all remaining rows from Project-details.xlsx here
];

// 2. Map & project-data for markers
// Aggregate by city
function buildCityAggregation() {
  const cityMap = new Map();
  projectDirectory.forEach((p) => {
    if (!p.city) return;
    const key = p.city.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, {
        city: p.city,
        region: p.region,
        projects: []
      });
    }
    cityMap.get(key).projects.push(p);
  });
  return Array.from(cityMap.values());
}

// Basic city -> coordinates mapping (extend as needed)
const cityCoordinates = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Pune: [18.5204, 73.8567],
  Bengaluru: [12.9716, 77.5946],
  Kolkata: [22.5726, 88.3639],
  "Navi Mumbai": [19.033, 73.0297],
  Noida: [28.5355, 77.391],
  Guwahati: [26.1445, 91.7362],
  Lucknow: [26.8467, 80.9462]
};

// 3. Map initialisation (only if map element exists)
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

  const cityAgg = buildCityAggregation();
  cityAgg.forEach((c) => {
    const coords = cityCoordinates[c.city] || null;
    if (!coords) return;
    const marker = L.circleMarker(coords, {
      radius: 7,
      color: "#000",
      weight: 2,
      fillColor: "#34c0c9",
      fillOpacity: 0.9
    }).addTo(map);

    const brands = Array.from(
      new Set(c.projects.map((p) => p.brand || p.client))
    ).join(", ");
    const years = `${Math.min(
      ...c.projects.map((p) => p.year)
    )} – ${Math.max(...c.projects.map((p) => p.year))}`;

    marker.bindPopup(
      `<strong>${c.city}</strong><br/>Brands: ${brands}<br/>Years: ${years}`
    );

    marker.on("click", () => {
      // When click on city marker, prefilter directory to that city
      const cityFilter = document.getElementById("filter-city");
      if (cityFilter) {
        cityFilter.value = c.city;
        applyDirectoryFilters();
        const directorySection = document.getElementById("projects-directory");
        if (directorySection) {
          directorySection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// 4. Directory filters and rendering
const yearFilter = document.getElementById("filter-year");
const brandFilter = document.getElementById("filter-brand");
const cityFilter = document.getElementById("filter-city");
const regionFilter = document.getElementById("filter-region");
const searchInput = document.getElementById("filter-search");
const clearBtn = document.getElementById("filter-clear");
const resultsContainer = document.getElementById("directory-results");
const summaryEl = document.getElementById("directory-summary");

function initDirectoryFilters() {
  if (!resultsContainer) return;

  // Populate dropdowns from data
  const years = Array.from(
    new Set(projectDirectory.map((p) => p.year).filter(Boolean))
  ).sort((a, b) => a - b);
  years.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearFilter.appendChild(opt);
  });

  const brands = Array.from(
    new Set(projectDirectory.map((p) => p.brand || p.client).filter(Boolean))
  ).sort();
  brands.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    brandFilter.appendChild(opt);
  });

  const cities = Array.from(
    new Set(projectDirectory.map((p) => p.city).filter(Boolean))
  ).sort();
  cities.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    cityFilter.appendChild(opt);
  });

  yearFilter.addEventListener("change", applyDirectoryFilters);
  brandFilter.addEventListener("change", applyDirectoryFilters);
  cityFilter.addEventListener("change", applyDirectoryFilters);
  regionFilter.addEventListener("change", applyDirectoryFilters);
  searchInput.addEventListener("input", applyDirectoryFilters);
  clearBtn.addEventListener("click", () => {
    yearFilter.value = "";
    brandFilter.value = "";
    cityFilter.value = "";
    regionFilter.value = "";
    searchInput.value = "";
    applyDirectoryFilters();
  });

  applyDirectoryFilters();
}

function applyDirectoryFilters() {
  if (!resultsContainer) return;

  const yearVal = yearFilter.value;
  const brandVal = brandFilter.value;
  const cityVal = cityFilter.value;
  const regionVal = regionFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  let filtered = projectDirectory.slice();

  if (yearVal) {
    filtered = filtered.filter((p) => String(p.year) === yearVal);
  }
  if (brandVal) {
    filtered = filtered.filter(
      (p) => (p.brand || p.client) === brandVal
    );
  }
  if (cityVal) {
    filtered = filtered.filter((p) => p.city === cityVal);
  }
  if (regionVal) {
    filtered = filtered.filter((p) => p.region === regionVal);
  }
  if (query) {
    filtered = filtered.filter((p) =>
      (p.location || "").toLowerCase().includes(query)
    );
  }

  renderDirectoryResults(filtered);
}

function renderDirectoryResults(items) {
  resultsContainer.innerHTML = "";
  summaryEl.textContent = `${items.length} site(s) matching current filters`;

  if (!items.length) {
    resultsContainer.innerHTML =
      "<p>No projects match the selected filters.</p>";
    return;
  }

  items.forEach((p) => {
    const card = document.createElement("article");
    card.className = "directory-card";

    const header = document.createElement("div");
    header.className = "directory-card-header";

    const title = document.createElement("div");
    title.className = "directory-card-title";
    title.textContent = p.location || "(Location not specified)";

    const yearBadge = document.createElement("div");
    yearBadge.className = "directory-card-meta";
    yearBadge.textContent = p.year;

    header.appendChild(title);
    header.appendChild(yearBadge);

    const subtitle = document.createElement("div");
    subtitle.className = "directory-card-subtitle";
    subtitle.textContent = `${p.city || "City N/A"} • ${
      p.region || "Region N/A"
    }`;

    const brandEl = document.createElement("div");
    brandEl.className = "directory-card-brand";
    brandEl.textContent = p.brand || p.client;

    let imgHtml = "";
    if (p.image) {
      imgHtml = `<img src="${p.image}" alt="${p.brand || p.client} site">`;
    }

    const linkHtml = `<a href="projects.html?id=${encodeURIComponent(
      p.id
    )}" class="pill-button" style="margin-top:6px;align-self:flex-start;">
      View details
    </a>`;

    card.innerHTML = "";
    card.appendChild(header);
    card.appendChild(subtitle);
    card.appendChild(brandEl);
    if (imgHtml) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = imgHtml;
      card.appendChild(wrapper.firstChild);
    }
    const meta = document.createElement("div");
    meta.className = "directory-card-meta";
    meta.textContent = `Client: ${p.client}`;
    card.appendChild(meta);

    const linkWrapper = document.createElement("div");
    linkWrapper.innerHTML = linkHtml;
    card.appendChild(linkWrapper.firstChild);

    resultsContainer.appendChild(card);
  });
}

// 5. Project detail page population
(function () {
  const container = document.getElementById("project-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const project = projectDirectory.find((p) => p.id === id);

  if (!project) {
    container.innerHTML =
      "<p>Project details not found. Please return to the Projects Directory.</p>";
    return;
  }

  const imgHtml = project.image
    ? `<img src="${project.image}" alt="${project.brand}" class="project-image" />`
    : "";

  container.innerHTML = `
    <article class="project-detail-main">
      <h3>${project.brand || project.client}</h3>
      ${imgHtml}
      <p>${project.location || ""}</p>
    </article>
    <aside class="project-detail-sidebar">
      <h3>Key Metrics</h3>
      <ul class="project-metrics">
        <li><strong>Year:</strong> ${project.year}</li>
        <li><strong>Client:</strong> ${project.client}</li>
        <li><strong>Brand:</strong> ${project.brand || project.client}</li>
        <li><strong>City:</strong> ${project.city || "N/A"}</li>
        <li><strong>Region:</strong> ${project.region || "N/A"}</li>
      </ul>
    </aside>
  `;
})();

// 6. Init directory (on index.html only)
if (document.getElementById("directory-results")) {
  initDirectoryFilters();
}

// 7. Inject current year for snapshot
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// 8. Simple alert after form submission (Formspree)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function () {
    setTimeout(() => {
      alert("Thank you. Your enquiry has been submitted.");
    }, 400);
  });
}
