from fastapi import APIRouter,Form,UploadFile,File
router=APIRouter()
@router.post("/reports")
async def create_report(description:str=Form(""),voice_text:str=Form(""),lat:float|None=Form(None),lng:float|None=Form(None),image:UploadFile|None=File(None)):
 return {"report_id":"RQ-DEMO-001","analysis":{"incident":"Flood","severity":"Critical","affected_people":50,"needs":["Rescue","Medical"]}}
