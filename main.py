"""
A machine learning-powered book recommendation system
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="BookShelf API",
    description="Book recommendation system with ML capabilities",
    version="1.0.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
books_db = []
saved_books_db = []

# Pydantic models for request/response
class BookRecommendationRequest(BaseModel):
    genres: List[str]
    author_name: Optional[str] = None
    user_preferences: Optional[dict] = {}

class Book(BaseModel):
    id: Optional[int]
    title: str
    description: str
    author: Optional[str] = None
    cover_url: Optional[str] = None

class SaveBookRequest(BaseModel):
    title: str
    description: str

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Welcome to BookShelf API",
        "version": "1.0.0",
        "endpoints": {
            "/docs": "API documentation",
            "/health": "Health check",
            "/recommendations": "Get book recommendations (POST)",
            "/saved-books": "Manage saved books (GET, POST, DELETE)"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "BookShelf API"
    }

@app.post("/upload-image")
async def upload_book_image(file: UploadFile = File(...)):
    """
    Upload book cover image (for future ML model integration)
    Returns file info for now, can be extended to use computer vision models
    """
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Save file
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "message": "Image uploaded successfully",
            "filename": file.filename,
            "file_path": file_path,
            "size_bytes": len(content)
            # In production, add ML model inference here
            # image_features = ml_model.predict(file_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/recommendations")
async def get_book_recommendations(request: BookRecommendationRequest):
    """
    Get personalized book recommendations based on user preferences
    
    This simulates an ML model that would analyze:
    - Selected genres
    - Author preferences
    - Historical reading patterns
    - Book cover features (from uploaded images)
    """
    try:
        # Mock ML model recommendations
        # In production, replace with actual ML model predictions
        genre_mapping = {
            "Mystery": ["The Silent Patient", "The Girl on the Train", "Gone Girl"],
            "Fiction": ["The Seven Husbands of Evelyn Hugo", "Book Lovers", "The Book Thief"],
            "Non-fiction": ["Educated: A Memoir", "Sapiens", "Atomic Habits"],
            "Science": ["A Brief History of Time", "Cosmos", "The Selfish Gene"],
            "Business": ["Atomic Habits", "The Lean Startup", "Thinking, Fast and Slow"],
            "History": ["Sapiens", "Guns, Germs, and Steel", "The Rise and Fall of the Third Reich"],
            "Biography": ["Educated: A Memoir", "Steve Jobs", "Becoming"],
            "Thriller": ["The Silent Patient", "The Girl on the Train", "The Da Vinci Code"],
            "Poetry": ["Milk and Honey", "The Sun and Her Flowers", "Leaves of Grass"],
            "Classic": ["Pride and Prejudice", "1984", "To Kill a Mockingbird"],
            "Horror": ["The Shining", "It", "Dracula"]
        }
        
        # Simulate ML-based recommendation engine
        recommendations = []
        
        # Analyze user selections
        selected_genres = request.genres if request.genres else []
        
        # Mock recommendation generation (would be ML model in production)
        mock_recommendations = [
            {
                "title": "The Silent Patient",
                "description": "A gripping psychological thriller about a woman who refuses to speak after allegedly murdering her husband. Perfect for mystery and thriller fans.",
                "relevance_score": 0.95
            },
            {
                "title": "Educated: A Memoir",
                "description": "A powerful memoir about a woman who grows up in a survivalist Mormon family and eventually earns a PhD from Cambridge University.",
                "relevance_score": 0.88
            },
            {
                "title": "The Seven Husbands of Evelyn Hugo",
                "description": "A captivating novel about a reclusive Hollywood icon who finally decides to tell her life story to an unknown journalist.",
                "relevance_score": 0.92
            }
        ]
        
        # Filter based on genres if provided
        if selected_genres:
            # In production, ML model would use genre embeddings for matching
            pass
        
        return {
            "recommendations": mock_recommendations,
            "user_preferences": {
                "genres": selected_genres,
                "author_name": request.author_name
            },
            "model_version": "v1.0-mock",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/saved-books")
async def get_saved_books():
    """Get all saved books"""
    return {
        "saved_books": saved_books_db,
        "count": len(saved_books_db)
    }

@app.post("/saved-books")
async def save_book(book: Book):
    """Save a book to the user's reading list"""
    try:
        book_id = len(saved_books_db) + 1
        book_data = {
            "id": book_id,
            "title": book.title,
            "description": book.description,
            "author": book.author,
            "saved_at": datetime.now().isoformat()
        }
        saved_books_db.append(book_data)
        
        return {
            "message": "Book saved successfully",
            "book": book_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save book: {str(e)}")

@app.delete("/saved-books/{book_id}")
async def delete_saved_book(book_id: int):
    """Remove a book from saved list"""
    global saved_books_db
    
    try:
        # Find and remove book
        for i, book in enumerate(saved_books_db):
            if book.get("id") == book_id:
                saved_books_db.pop(i)
                return {
                    "message": "Book removed successfully",
                    "book_id": book_id
                }
        
        raise HTTPException(status_code=404, detail="Book not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete book: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

