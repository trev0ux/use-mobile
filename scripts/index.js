let employers = [];
let sectors = [];
let selectedSectors = [];

document.addEventListener("DOMContentLoaded", function () {
  getEmployersAndSectors();
});

function getEmployersAndSectors() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      employers = data.employers;
      sectors = data.sectors;

      populateEmployers();
      populateFilters();

      selectedSectors = sectors.map((sector) => sector.id);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function populateEmployers() {
  const employersList = document.querySelector(".employers-list-js");
  employersList.innerHTML = "";

  employers.forEach((item, index) => {
    const employersCard = document.createElement("div");
    employersCard.classList.add("search__employer-card");

    const title = document.createElement("h2");
    title.textContent = item.name;

    const sectorMatch = sectors.find((sector) => sector.id == item.sectorId);

    employersCard.dataset.sector = sectorMatch.name;

    const sector = document.createElement("h4");

    sector.textContent = `Setor: ${sectorMatch.name}`;

    const registration = document.createElement("h3");
    registration.innerHTML = `Matrícula: ${item.registration} <span>${
      sectors[index]?.id ?? ""
    }</span>`;

    employersCard.appendChild(title);
    employersCard.appendChild(registration);
    employersCard.appendChild(sector);

    employersList.appendChild(employersCard);
  });
}

function populateFilters() {
  const filtersList = document.querySelector(".filters-js");
  filtersList.innerHTML = "";

  sectors.forEach((item, index) => {
    const div = document.createElement("div");

    div.classList.add("form-check");

    const label = document.createElement("label");
    label.setAttribute("for", `${item.name}-${index}`);
    label.textContent = item.name;

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", `${item.name}-${index}`);

    input.addEventListener("change", () => {
      handleCheckboxChange(item.name, input.checked);
    });

    div.appendChild(input);
    div.appendChild(label);

    const li = document.createElement("li");

    li.appendChild(div);

    filtersList.appendChild(li);
  });
}

function handleCheckboxChange(sectorId, checked) {
  if (checked) {
    selectedSectors.push(sectorId);
  } else {
    selectedSectors = selectedSectors.filter((id) => id !== sectorId);
  }
  filterItems(selectedSectors);
  showFilteredItems(sectorId, checked);
}

function filterItems(selectedSectors) {
  const items = document.querySelectorAll(".search__employer-card");

  items.forEach((item) => {
    const sector = item.dataset.sector;
    if (selectedSectors.length === 5 || selectedSectors.includes(sector)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function showFilteredItems(item, checked) {
  const selectedFilter = document.querySelector(".selected-filter-js");

  let displayedItems = [];
  if (checked) {
    if (!displayedItems.includes(item) && typeof item === "string") {
      const li = document.createElement("li");

      selectedFilter.appendChild(li);

      displayedItems.push(item);
      li.innerHTML = displayedItems;
    }
  } else {
    for (const li of selectedFilter.querySelectorAll("li")) {
      if (li.textContent.trim() === item) {
        li.remove();
        break;
      }
    }
  }
}
