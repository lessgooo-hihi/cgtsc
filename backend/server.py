from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid
from datetime import datetime
import httpx
import csv
import io


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class Notice(BaseModel):
    title: str
    date: str
    description: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Chatkhil Government Technical School and College API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.get("/notices", response_model=List[Notice])
async def get_notices():
    """Fetch notices from Google Sheets CSV export"""
    try:
        # Convert Google Sheets share link to CSV export link
        sheets_id = "1FGNgaNGtq4rDewGnVDkGpBbclHx9bFST6FFebRwcGnM"
        csv_url = f"https://docs.google.com/spreadsheets/d/{sheets_id}/export?format=csv"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(csv_url)
            response.raise_for_status()
            
            # Parse CSV data
            csv_data = response.text
            csv_reader = csv.DictReader(io.StringIO(csv_data))
            
            notices = []
            for row in csv_reader:
                # Assuming columns: Notice Title, Date, Description
                if row.get('Notice Title') and row.get('Date'):
                    notice = Notice(
                        title=row.get('Notice Title', '').strip(),
                        date=row.get('Date', '').strip(),
                        description=row.get('Description', '').strip() or row.get('Link', '').strip()
                    )
                    notices.append(notice)
            
            return notices[:10]  # Return latest 10 notices
            
    except Exception as e:
        logger.error(f"Error fetching notices: {str(e)}")
        # Return sample notices if API fails
        return [
            Notice(
                title="Welcome to New Academic Year 2025",
                date="2025-01-15",
                description="Classes will commence from January 20, 2025"
            ),
            Notice(
                title="Admission Open for Technical Programs",
                date="2025-01-10",
                description="Applications are now open for all technical courses"
            ),
            Notice(
                title="Annual Sports Day",
                date="2025-01-05",
                description="Sports competition will be held on February 15, 2025"
            )
        ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()