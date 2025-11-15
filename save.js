// Sidebar handlers
(function () {
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const panel = document.getElementById('sidebarPanel');

    function open() {
        panel.style.transform = "translateX(0)";
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
    function close() {
        panel.style.transform = "translateX(-100%)";
        overlay.classList.add("hidden");
        document.body.style.overflow = "";
    }

    openBtn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    overlay?.addEventListener("click", close);
    document.addEventListener("keydown", e => e.key === "Escape" && close());
})();

// Backend API
const API_BASE_URL = "http://localhost:8000";

const booksGrid = document.getElementById("booksGrid");
const emptyState = document.getElementById("emptyState");
const bookModal = document.getElementById("bookModal");
const modalContent = document.getElementById("modalContent");

let savedBooks = [];

displaySavedBooks();

async function displaySavedBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/saved-books`);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        savedBooks = data.saved_books || [];

        // Empty
        if (savedBooks.length === 0) {
            emptyState.classList.remove("hidden");
            booksGrid.classList.add("hidden");
            return;
        }

        emptyState.classList.add("hidden");
        booksGrid.classList.remove("hidden");
        booksGrid.innerHTML = "";

        savedBooks.forEach((book, index) => {
            const div = document.createElement("div");
            div.className =
                "bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2";

            div.innerHTML = `
                <div class="text-5xl mb-4 text-center">📚</div>
                <h3 class="text-xl font-bold text-center">${book.title}</h3>
                <p class="text-gray-600 mb-4 text-sm line-clamp-3">${book.description}</p>
                
                <button onclick="viewBook(${index})" 
                    class="w-full bg-purple-600 text-white py-2 rounded-lg mb-2">
                    👁️ View Details
                </button>

                <button onclick="removeBook(${book.id})" 
                    class="w-full bg-red-600 text-white py-2 rounded-lg">
                    🗑️ Remove
                </button>
            `;
            booksGrid.appendChild(div);
        });
    } catch (err) {
        alert("⚠️ Unable to load saved books. Check if FastAPI is running.");
    }
}

function viewBook(index) {
    const book = savedBooks[index];

    modalContent.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">${book.title}</h2>
        <p class="text-gray-600 mb-6">${book.description}</p>

        <div class="flex gap-4">
            <button onclick="closeModal()" class="flex-1 bg-gray-600 text-white py-3 rounded-lg">
                Close
            </button>
            <button onclick="removeBookFromModal(${index})" class="flex-1 bg-red-600 text-white py-3 rounded-lg">
                Remove
            </button>
        </div>
    `;

    bookModal.style.display = "flex";
}

function closeModal() {
    bookModal.style.display = "none";
}

async function removeBook(id) {
    if (!confirm("Remove this book?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/saved-books/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error");

        displaySavedBooks();
        alert("✨ Book removed!");
    } catch (e) {
        alert("⚠️ Failed to remove book.");
    }
}

function removeBookFromModal(index) {
    removeBook(savedBooks[index].id);
    closeModal();
}

bookModal.addEventListener("click", e => {
    if (e.target === bookModal) closeModal();
});
