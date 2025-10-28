# 📚 BookShelf – Your Smart Reading Companion

A modern, responsive web application with **FastAPI backend** for machine learning-powered book recommendations. Built with **HTML, TailwindCSS, and Python (FastAPI)** to help users discover, get recommendations for, and save books to their reading list.

## 🌟 Features

- **Photo Upload**: Upload book cover images to FastAPI backend
- **ML-Powered Recommendations**: Get personalized book suggestions from FastAPI (ready for ML model integration)
- **Genre Selection**: Choose from 14 different reading preferences
- **Save for Later**: Store favorite books via FastAPI backend
- **FastAPI Backend**: Python-based API with CORS support
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Modern UI**: Clean design with TailwindCSS gradients and animations

## 🏗️ Architecture

### Frontend (HTML + TailwindCSS)
- `index.html` - Homepage with hero section
- `scan.html` - Upload & get recommendations
- `save.html` - View and manage saved books
- `contact.html` - Contact form

### Backend (FastAPI + Python)
- `main.py` - FastAPI application with REST endpoints
- `requirements.txt` - Python dependencies
- Ready for ML model integration (image processing, recommendation engine)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ 
- pip (Python package manager)

### Installation

1. **Clone or download the project**
   ```bash
   cd BookShelf
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI backend**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

5. **Open the frontend**
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8001
     
     # Then visit
     http://localhost:8001
     ```

### API Endpoints

Once the backend is running on `http://localhost:8000`:

- **GET** `/` - API information
- **GET** `/health` - Health check
- **POST** `/recommendations` - Get book recommendations (sends genres and author)
- **GET** `/saved-books` - Get all saved books
- **POST** `/saved-books` - Save a book
- **DELETE** `/saved-books/{id}` - Remove a saved book
- **POST** `/upload-image` - Upload book cover image

### Interactive API Documentation

Visit `http://localhost:8000/docs` for Swagger UI or `http://localhost:8000/redoc` for ReDoc.

## 📋 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No frameworks needed

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Pillow** - Image processing support
- **CORS Middleware** - Cross-origin support

## 🧠 Machine Learning Ready

The backend is structured to integrate ML models:

```python
# Example structure in main.py for future ML integration:
# - Image feature extraction from book covers
# - Genre-based recommendation engine
# - Collaborative filtering (user preferences)
# - Content-based filtering (book descriptions)
```

### Possible ML Enhancements

1. **Image Classification**: Use CNN to identify book covers
2. **Recommendation Engine**: Train collaborative filtering model
3. **NLP Analysis**: Sentiment analysis on book descriptions
4. **Content-Based Filtering**: Embed book descriptions using transformers

## 🎯 Project Structure

```
BookShelf/
├── index.html          # Homepage
├── scan.html           # Upload & recommendations
├── save.html           # Saved books display
├── contact.html         # Contact form
├── main.py             # FastAPI backend
├── requirements.txt    # Python dependencies
├── uploads/           # Uploaded book images (created automatically)
└── README.md          # This file
```

## 🔧 Development

### Running the Backend

```bash
# Development mode (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Testing the API

```bash
# Health check
curl http://localhost:8000/health

# Get recommendations
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"genres": ["Fiction", "Mystery"], "author_name": "Stephen King"}'

# Get saved books
curl http://localhost:8000/saved-books
```

## 📝 API Usage Examples

### Frontend → Backend Communication

```javascript
// Get recommendations
const response = await fetch('http://localhost:8000/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ genres: ['Fiction', 'Thriller'] })
});
const data = await response.json();

// Save a book
await fetch('http://localhost:8000/saved-books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Book Title',
        description: 'Book description...'
    })
});
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-to-pink gradients
- **Hover Effects**: Smooth transitions on interactive elements
- **Responsive Grid**: 1-4 columns based on screen size
- **Modal Popups**: View book details
- **Loading States**: User-friendly loading indicators
- **Sidebar Navigation**: Hamburger menu with project info

## 🚀 Deployment

### Backend Deployment (FastAPI)
- **Heroku**: Add `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **DigitalOcean**: Use App Platform
- **AWS**: Deploy on Lambda or EC2
- **Docker**: Create Dockerfile with uvicorn

### Frontend Deployment
- **GitHub Pages**: Host HTML files
- **Netlify**: Drag & drop deployment
- **Vercel**: Zero-config deployment

## 🔮 Future Enhancements

- [ ] Integrate real ML models for recommendation
- [ ] Add user authentication
- [ ] Connect to PostgreSQL database
- [ ] Add book cover OCR (Optical Character Recognition)
- [ ] Implement book rating system
- [ ] Add reading progress tracking
- [ ] Export reading list to PDF/CSV
- [ ] Social sharing features

## 💡 Learning Highlights

This project demonstrates:
- **FastAPI** backend development
- **RESTful API** design
- **CORS** handling
- **File uploads** handling
- **Pydantic** data validation
- **Async/await** patterns in Python
- **Frontend-backend integration**
- **Ready for ML model integration**

## 🤝 Contributing

This is a learning project. Feel free to:
- Add ML models for better recommendations
- Improve the UI/UX
- Add new features
- Fix bugs
- Optimize performance

## 📄 License

This project is open source and available for learning purposes.

---

**Built with ❤️ for book lovers everywhere** 📚✨

Happy Reading and Happy Coding!
