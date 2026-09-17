def calculate_severity(population_score,life_threat,infrastructure,isolation,medical):
 score=.40*population_score+.30*life_threat+.15*infrastructure+.10*isolation+.05*medical
 label="Critical" if score>=81 else "High" if score>=61 else "Medium" if score>=31 else "Low"
 return round(score,2),label
