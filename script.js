// script.js – map, directory, project detail, sample work, contact

// 1. Project directory data
// IMPORTANT: extend this array with ALL rows from Project-details.xlsx
// using the same structure. City & region are normalized manually.
// This array is PURE DATA (no images) powering filters and map. [file:124]
const projectDirectory = [
  {
    id: "2013-KFCH-KATRAJ-PUNE",
    year: 2013,
    client: "KFCH",
    brand: "KFC",
    city: "Pune",
    region: "West",
    location: "Katraj, Pune"
  },
  {
    id: "2013-KFCH-WAI-SATARA",
    year: 2013,
    client: "KFCH",
    brand: "KFC",
    city: "Satara",
    region: "West",
    location: "WAI, Satara"
  },
  {
    id: "2015-BK-JANAKPURI-DELHI",
    year: 2015,
    client: "Burger king",
    brand: "Burger King",
    city: "Delhi",
    region: "North",
    location: "Janakpuri, Delhi"
  },
  {
    id: "2015-CHAAYOS-TODI-MILLS",
    year: 2015,
    client: "Chaayos",
    brand: "Chaayos",
    city: "Mumbai",
    region: "West",
    location: "Todi mills, Lower Parel"
  },
  {
    id: "2018-MCD-VILE-PARLE-MUMBAI",
    year: 2018,
    client: "McDonalds",
    brand: "McDonald’s",
    city: "Mumbai",
    region: "West",
    location: "Vile Parle, Mumbai"
  },
  {
    id: "2022-SUBWAY-BANGALORE",
    year: 2022,
    client: "SUBWAY",
    brand: "Subway",
    city: "Bengaluru",
    region: "South",
    location: "Bangalore"
  },
  {
    id: "2023-CROMA-ANKLESHWAR",
    year: 2023,
    client: "CROMA",
    brand: "Croma",
    city: "Ankleshwar",
    region: "West",
    location: "Croma, Ankleshwar"
  },
  {
    id: "2023-PEPE-SOUTH-CITY-KOLKATA",
    year: 2023,
    client: "PEPE JEANS",
    brand: "Pepe Jeans",
    city: "Kolkata",
    region: "East",
    location: "South City, Kolkata"
  },
  {
    id: "2021-IZUMI-JUHU-MUMBAI",
    year: 2021,
    client: "IZUMI",
    brand: "Izumi",
    city: "Mumbai",
    region: "West",
    location: "Juhu, Mumbai"
  },
  {
    id: "2021-TACOBELL-PUNE",
    year: 2021,
    client: "TACO BELL",
    brand: "Taco Bell",
    city: "Pune",
    region: "West",
    location: "Pune"
  },
  {
    id: "2018-COPPER-CHIMNEY-DELUXE",
    year: 2018,
    client: "Copper Chimney",
    brand: "Copper Chimney",
    city: "Mumbai",
    region: "West",
    location: "Deluxe Caterers Pvt Ltd (Mumbai)"
  },
  {
    id: "2024-CTR-BANGALORE",
    year: 2024,
    client: "CTR",
    brand: "CTR",
    city: "Bengaluru",
    region: "South",
    location: "Bangalore"
  },
  {
    id: "2023-YOUMEE-INFINITI-ANDHERI",
    year: 2023,
    client: "LBF",
    brand: "YouMee",
    city: "Mumbai",
    region: "West",
    location: "YouMee, Infiniti Mall, Andheri"
  }
  // TODO: add all remaining rows from Project-details.xlsx here
];

// 2. Sample images – only a few representative projects
// These filenames must match the files in your GitHub repo. [file:107-118]
const sampleImages = [
  {
    brand: "Burger King",
    file: "BURGER-KING-IMAGE.jpg",
    label: "Burger King – sample outlet"
  },
  {
    brand: "McDonald’s",
    file: "MCDONALDS-IMAGE.jpg",
    label: "McDonald’s – sample outlet"
  },
  {
    brand: "Subway",
    file: "SUBWAY-IMAGE.jpg",
    label: "Subway – sample outlet"
  },
  {
    brand: "Croma",
    file: "CROMA-IMAGE.jpg",
    label: "Croma – sample electronics store"
  },
  {
    brand: "Pepe Jeans",
    file: "PEPE-JEANS-IMAGE.jpg",
    label: "Pepe Jeans – sample fashion store"
  },
  {
    brand: "Copper Chimney",
    file: "COPPER-CHIMNEY-IMAGE.jpg",
    label: "Copper Chimney – sample restaurant"
  },
  {
    brand: "Taco Bell",
    file: "TACO-BELL-IMAGE.jpg",
    label: "Taco Bell – sample outlet"
  },
  {
    brand: "Izumi",
    file: "IZUMI-IMAGE.jpg",
    label: "Izumi – ramen & sushi outlet"
  },
  {
    brand: "Chaayos",
    file: "CHAAYOS-IMAGE.jpg",
    label: "Chaayos – experiments with chai"
  },
  {
    brand: "CTR",
    file: "CTR-IMAGE.jpg",
    label: "CTR – sample outlet"
  },
  {
    brand: "YouMee / LBF",
    file: "LBF-IMAGE-2.jpg",
    label: "YouMee – sample outlet"
  }
];

// 3. Map & city aggregation
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

// City -> approximate coordinates (extend as needed)
const cityCoordinates = {
  Mumbai: [19.076, 72.8777],
  "Navi Mumbai": [19.033, 73.0297],
  Pune: [18.5204, 73.8567],
  Satara: [17.6914, 74.0003],
  Thane: [19.2183, 72.9781],
  Delhi: [28.6139, 77.209],
  Gurgaon: [28.4595, 77.0266],
  Noida: [28.5355, 77.391],
  "Greater Noida": [28.4744, 77.503],
  Kanpur: [26.4499, 80.3319],
  Lucknow: [26.8467, 80.9462],
  Varanasi: [25.3176, 82.9739],
  Prayagraj: [25.4358, 81.8463],
  Jaipur: [26.9124, 75.7873],
  Indore: [22.7196, 75.8577],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Ankleshwar: [21.6269, 72.9994],
  Kolkata: [22.5726, 88.3639],
  Siliguri: [26.7271, 88.3953],
  Guwahati: [26.1445, 91.7362],
  Dimapur: [25.9117, 93.7266],
  Itanagar: [27.0844, 93.6053],
  Gangtok: [27.3389, 88.6065],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Mangalore: [12.9141, 74.856],
  Kochi: [9.9312, 76.2673],
  Hubli: [15.3647, 75.124]
};

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
    .zoom({ position: "bottomright" })
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

    const meta = document.createElement("div");
    meta.className = "directory-card-meta";
    meta.textContent = `Client: ${p.client}`;

    const link = document.createElement("a");
    link.href = `projects.html?id=${encodeURIComponent(p.id)}`;
    link.className = "pill-button";
    link.style.marginTop = "6px";
    link.style.alignSelf = "flex-start";
    link.textContent = "View details";

    card.appendChild(header);
    card.appendChild(subtitle);
    card.appendChild(brandEl);
    card.appendChild(meta);
    card.appendChild(link);

    resultsContainer.appendChild(card);
  });
}

// 5. Project detail page
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

  container.innerHTML = `
    <article class="project-detail-main">
      <h3>${project.brand || project.client}</h3>
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

// 6. Sample work gallery
function renderSampleWork() {
  const grid = document.getElementById("sample-work-grid");
  if (!grid) return;

  grid.innerHTML = "";
  sampleImages.forEach((item) => {
    const card = document.createElement("article");
    card.className = "directory-card";

    const title = document.createElement("div");
    title.className = "directory-card-title";
    title.textContent = item.brand;

    const img = document.createElement("img");
    img.src = item.file;
    img.alt = item.label;

    const subtitle = document.createElement("div");
    subtitle.className = "directory-card-subtitle";
    subtitle.textContent = item.label;

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(subtitle);

    grid.appendChild(card);
  });
}

// 7. Init on index.html
if (document.getElementById("directory-results")) {
  initDirectoryFilters();
}
if (document.getElementById("sample-work-grid")) {
  renderSampleWork();
}

// 8. Inject current year for snapshot
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// 9. Simple notification after form submission
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function () {
    setTimeout(() => {
      alert("Thank you. Your enquiry has been submitted.");
    }, 400);
  });
}
