from fastapi import APIRouter
router=APIRouter()
@router.get("/incidents")
def get_incidents(): return [{"id":"INC-104","type":"Flood","severity":"Critical","affected":62,"lat":26.45,"lng":80.35},{"id":"INC-105","type":"Fire","severity":"High","affected":31,"lat":26.46,"lng":80.34}]
