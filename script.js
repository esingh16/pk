// script.js

// Data model: cities and nested sites
const projectData = {
  cities: [
    {
      name: "Mumbai",
      description: "Key residential and commercial projects in Mumbai.",
      sites: [
        {
          name: "Bandra Site",
          area: "Bandra",
          details:
            "Premium high‑rise residential tower overlooking the sea."
        },
        {
          name: "Santacruz Site",
          area: "Santacruz",
          details:
            "Mixed‑use commercial hub near the airport with office and retail."
        },
        {
          name: "Malad Site",
          area: "Malad",
          details:
            "IT and business park designed for flexible office layouts."
        }
      ]
    },
    {
      name: "Bengaluru",
      description: "Technology‑focused office and residential campuses.",
      sites: [
        {
          name: "Whitefield Campus",
          area: "Whitefield",
          details:
            "Large tech campus with green open spaces and shared amenities."
        },
        {
          name: "Electronic City Towers",
          area: "Electronic City",
          details:
            "Grade‑A office towers for IT and startup ecosystems."
        }
      ]
    },
    {
      name: "Pune",
      description: "IT and residential developments in Pune.",
      sites: [
        {
          name: "Hinjawadi Tech Park",
          area: "Hinjawadi",
          details:
            "Multi‑phase technology park with modern infrastructure."
        }
      ]
    }
  ]
};

const infoTitle = document.getElementById("info-title");
const infoContent = document.getElementById("info-content");

// Show city summary and list of its sites
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
  const siteItems = infoContent.querySelectorAll(".site-item");
  siteItems.forEach((item) => {
    item.addEventListener("click", () => {
      const cityName = item.getAttribute("data-city");
      const idx = parseInt(item.getAttribute("data-site-index"), 10);
      const c = projectData.cities.find((c) => c.name === cityName);
      if (!c) return;
      const site = c.sites[idx];
      showSite(c, site);
    });
  });
}

// Show individual site details
function showSite(city, site) {
  infoTitle.textContent = site.name;
  infoContent.innerHTML = `
    <p><strong>${site.area}, ${city.name}</strong></p>
    <p>${site.details}</p>
    <button id="back-to-city">Back to ${city.name}</button>
  `;

  const backBtn = document.getElementById("back-to-city");
  backBtn.addEventListener("click", () => showCity(city));
}

// Attach click handlers to SVG city points
document.querySelectorAll(".city-point").forEach((circle) => {
  circle.addEventListener("click", () => {
    const cityName = circle.getAttribute("data-city");
    const city = projectData.cities.find((c) => c.name === cityName);
    if (!city) return;

    // Visual feedback: briefly scale the point
    circle.classList.add("active-city");
    setTimeout(() => circle.classList.remove("active-city"), 200);

    showCity(city);
  });
});
