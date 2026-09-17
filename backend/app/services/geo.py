from math import radians,sin,cos,asin,sqrt
def haversine_km(lat1,lon1,lat2,lon2):
 r=6371.0;dlat=radians(lat2-lat1);dlon=radians(lon2-lon1);a=sin(dlat/2)**2+cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
 return 2*r*asin(sqrt(a))
