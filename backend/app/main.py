from fastapi import FastAPI
from app.routes.reports import router as reports
from app.routes.incidents import router as incidents
from app.routes.resources import router as resources
from app.routes.allocations import router as allocations
app=FastAPI(title="ResQ-AI API")
@app.get("/")
def root(): return {"message":"ResQ-AI API is running"}
app.include_router(reports,prefix="/api");app.include_router(incidents,prefix="/api");app.include_router(resources,prefix="/api");app.include_router(allocations,prefix="/api")
