let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // 1️⃣ Fetch & render all toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => toys.forEach(toy => toyCollection.appendChild(createToyCard(toy))))
    .catch(err => console.error("GET toys failed:", err));

  // 2️⃣ Handle form submission (POST)
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        toyCollection.appendChild(createToyCard(toy));
        toyForm.reset();
        addToy = false;
        toyFormContainer.style.display = "none";
      })
      .catch(err => console.error("POST toy failed:", err));
  });

  // 3️⃣ Delegate "like" button clicks (PATCH)
  toyCollection.addEventListener("click", e => {
    if (e.target.classList.contains("like-btn")) {
      const card = e.target.closest(".card");
      const likesP = card.querySelector("p");
      const toyId = e.target.dataset.id;
      const newLikes = parseInt(likesP.textContent) + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(response => response.json())
        .then(updatedToy => {
          likesP.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(err => console.error("PATCH likes failed:", err));
    }
  });

  // Helper: create a toy card DOM element
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    return card;
  }
});
