// -------------------- SIDEBAR --------------------
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarPanel = document.getElementById("sidebarPanel");

openSidebar.onclick = () => {
    sidebarPanel.classList.remove("-translate-x-full");
    sidebarOverlay.classList.remove("hidden");
};

closeSidebar.onclick = () => {
    sidebarPanel.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
};

sidebarOverlay.onclick = closeSidebar;

// -------------------- PHOTO PREVIEW --------------------
const bookPhoto = document.getElementById("bookPhoto");
const previewImg = document.getElementById("previewImg");
const photoPreview = document.getElementById("photoPreview");

bookPhoto.addEventListener("change", () => {
    const file = bookPhoto.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
            photoPreview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});

// -------------------- GET RECOMMENDATION --------------------
const btn = document.getElementById("getRecommendationBtn");
const results = document.getElementById("resultsSection");
const recommendationsDiv = document.getElementById("recommendations");

btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "⏳ Loading...";

    const genres = Array.from(document.querySelectorAll(".genre-checkbox:checked"))
        .map(cb => cb.value);

    const author = document.getElementById("authorName").value;

    // Upload image if selected
    let imageUploaded = false;
    const photoFile = bookPhoto.files[0];
    if (photoFile) {
        try {
            const formData = new FormData();
            formData.append("file", photoFile);
            
            const uploadRes = await fetch("/upload-image", {
                method: "POST",
                body: formData
            });
            
            if (uploadRes.ok) {
                imageUploaded = true;
                console.log("Image uploaded successfully");
            }
        } catch (err) {
            console.warn("Image upload failed, continuing without image:", err);
        }
    }

    // Get recommendations
    try {
        const res = await fetch("/recommendations", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                genres: genres,
                author_name: author || null
            })
        });

        if (!res.ok) throw new Error("API Error");

        const data = await res.json();
        displayRecommendations(data.recommendations);

    } catch (err) {
        alert("⚠️ Failed to connect to API. Make sure FastAPI server is running.");
        console.error(err);

    } finally {
        btn.disabled = false;
        btn.textContent = "👩🏻‍🏫 Get Recommendations";
    }
});

// -------------------- DISPLAY RESULTS --------------------
function displayRecommendations(books) {
    recommendationsDiv.innerHTML = "";
    window.currentRecommendations = books;

    books.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = "border border-gray-200 p-4 rounded-lg shadow-sm";
        card.innerHTML = `
            <h3 class="text-xl font-bold">${book.title}</h3>
            <p class="text-gray-600">${book.description}</p>
            <button class="btn-primary mt-3" onclick="saveBook(${index})">❤️ Save</button>
        `;
        recommendationsDiv.appendChild(card);
    });

    results.classList.remove("hidden");
}

// -------------------- SAVE BOOK --------------------
async function saveBook(i) {
    const book = window.currentRecommendations[i];

    try {
        const res = await fetch("/saved-books", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: book.title,
                description: book.description,
                author: null
            })
        });

        if (!res.ok) throw new Error("Save failed");

        alert(`✅ Saved: ${book.title}`);

    } catch (err) {
        console.error(err);
        alert("⚠️ Could not save book. Make sure FastAPI server is running.");
    }
}
