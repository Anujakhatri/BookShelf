// Sidebar open/close handlers
        (function() {
            const openBtn = document.getElementById('openSidebar');
            const closeBtn = document.getElementById('closeSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const panel = document.getElementById('sidebarPanel');

            function open() {
                panel.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            function close() {
                panel.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
            openBtn && openBtn.addEventListener('click', open);
            closeBtn && closeBtn.addEventListener('click', close);
            overlay && overlay.addEventListener('click', close);
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        })();

        // Get references to DOM elements
        const bookPhotoInput = document.getElementById('bookPhoto');
        const photoPreview = document.getElementById('photoPreview');
        const previewImg = document.getElementById('previewImg');
        const getRecommendationBtn = document.getElementById('getRecommendationBtn');
        const resultsSection = document.getElementById('resultsSection');    //Section where api results will appear
        const recommendationsDiv = document.getElementById('recommendations'); //recommendated books or related info will be added

        // API Base URL - FastAPI backend
        const API_BASE_URL = 'http://localhost:8000';

        // Handle photo upload and preview
        bookPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle Get Recommendation button click - Now calls FastAPI
        getRecommendationBtn.addEventListener('click', async function() {
            // Show loading state
            getRecommendationBtn.disabled = true;
            getRecommendationBtn.textContent = '⏳ Loading...';

            try {
                // Get selected genres
                const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked'))
                    .map(cb => cb.value);
                const authorName = document.getElementById('authorName').value;

                // Call FastAPI backend
                const response = await fetch(`${API_BASE_URL}/recommendations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        genres: selectedGenres,
                        author_name: authorName || null
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get recommendations');
                }

                const data = await response.json();
                
                // Display recommendations from API
                displayRecommendations(data.recommendations);

                // Reset button state
                getRecommendationBtn.disabled = false;
                getRecommendationBtn.textContent = '👩🏻‍🏫 Get Recommendations';

            } catch (error) {
                console.error('Error fetching recommendations:', error);
                alert('⚠️ Failed to connect to API. Make sure the FastAPI server is running on http://localhost:8000');
                
                // Reset button state
                getRecommendationBtn.disabled = false;
                getRecommendationBtn.textContent = '👩🏻‍🏫 Get Recommendations';
            }
        });

        // Display recommendations on the page
        function displayRecommendations(books) {
            // Clear previous recommendations
            recommendationsDiv.innerHTML = '';

            books.forEach((book, index) => {
                const bookCard = document.createElement('div');
                bookCard.className = 'border border-gray-200 rounded-lg p-6 hover:shadow-lg transition';
                bookCard.innerHTML = `
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${book.title}</h3>
                    <p class="text-gray-600 mb-4">${book.description}</p>
                    <button onclick="saveBook(${index})" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                        ❤️ Save Book
                    </button>
                `;
                recommendationsDiv.appendChild(bookCard);
            });

            // Store recommendations in a global variable for save function
            window.currentRecommendations = books;

            // Show results section
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Save book to FastAPI backend
        async function saveBook(index) {
            const book = window.currentRecommendations[index];
            
            try {
                // Call FastAPI to save the book
                const response = await fetch(`${API_BASE_URL}/saved-books`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: book.title,
                        description: book.description,
                        author: null
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to save book');
                }

                const data = await response.json();
                
                // Show success message
                alert(`✨ "${book.title}" saved successfully!`);
            } catch (error) {
                console.error('Error saving book:', error);
                alert('⚠️ Failed to save book. Make sure the FastAPI server is running.');
            }
        }