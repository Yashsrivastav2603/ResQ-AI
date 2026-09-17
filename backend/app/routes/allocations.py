from fastapi import APIRouter
router=APIRouter()
@router.post("/allocations")
def allocate(payload:dict): return {"allocation_id":"AL-001","status":"Approved","resource_id":payload.get("resource_id")}
