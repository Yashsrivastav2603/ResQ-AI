def resource_score(severity,population,resource_match,distance_score): return round(.45*severity+.25*population+.20*resource_match+.10*distance_score,2)
def recommend_resource(resources,incident):
 candidates=[r for r in resources if r.get("status")=="Available"]
 return candidates[0] if candidates else None
