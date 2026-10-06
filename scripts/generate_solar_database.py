import math
import json
import csv
import os

# Complete 31 provinces of Iran with English and Persian names, capitals, and coordinates
PROVINCES = [
    {"nameEn": "Tehran", "nameFa": "تهران", "capitalEn": "Tehran", "capitalFa": "تهران", "lat": 35.6892, "lon": 51.3890, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 32.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 21, "autumnTilt": 59, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Isfahan", "nameFa": "اصفهان", "capitalEn": "Isfahan", "capitalFa": "اصفهان", "lat": 32.6546, "lon": 51.6680, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 12, "summerTilt": 20, "autumnTilt": 56, "winterTilt": 49, "annualTilt": 32},
    {"nameEn": "Fars", "nameFa": "فارس", "capitalEn": "Shiraz", "capitalFa": "شیراز", "lat": 29.5918, "lon": 52.5837, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 14, "summerTilt": 18, "autumnTilt": 53, "winterTilt": 46, "annualTilt": 29},
    {"nameEn": "Razavi Khorasan", "nameFa": "خراسان رضوی", "capitalEn": "Mashhad", "capitalFa": "مشهد", "lat": 36.2605, "lon": 59.6168, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 32.0, "minSocKwh": 7.17, "springTilt": 8, "summerTilt": 22, "autumnTilt": 60, "winterTilt": 51, "annualTilt": 35},
    {"nameEn": "East Azerbaijan", "nameFa": "آذربایجان شرقی", "capitalEn": "Tabriz", "capitalFa": "تبریز", "lat": 38.0800, "lon": 46.2919, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 35.0, "minSocKwh": 7.17, "springTilt": 7, "summerTilt": 24, "autumnTilt": 62, "winterTilt": 53, "annualTilt": 37},
    {"nameEn": "Khuzestan", "nameFa": "خوزستان", "capitalEn": "Ahvaz", "capitalFa": "اهواز", "lat": 31.3183, "lon": 48.6706, "baseLoad": 1.25, "nightLoad": 1.98, "pvCapacityKw": 5.5, "batteryCapKwh": 34.0, "minSocKwh": 7.17, "springTilt": 13, "summerTilt": 19, "autumnTilt": 55, "winterTilt": 48, "annualTilt": 31},
    {"nameEn": "Gilan", "nameFa": "گیلان", "capitalEn": "Rasht", "capitalFa": "رشت", "lat": 37.2808, "lon": 49.5832, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 4.8, "batteryCapKwh": 30.0, "minSocKwh": 7.17, "springTilt": 8, "summerTilt": 23, "autumnTilt": 61, "winterTilt": 52, "annualTilt": 36},
    {"nameEn": "Yazd", "nameFa": "یزد", "capitalEn": "Yazd", "capitalFa": "یزد", "lat": 31.8974, "lon": 54.3569, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.2, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 13, "summerTilt": 19, "autumnTilt": 55, "winterTilt": 48, "annualTilt": 31},
    {"nameEn": "Kerman", "nameFa": "کرمان", "capitalEn": "Kerman", "capitalFa": "کرمان", "lat": 30.2839, "lon": 57.0834, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.2, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 14, "summerTilt": 18, "autumnTilt": 54, "winterTilt": 47, "annualTilt": 30},
    {"nameEn": "Hormozgan", "nameFa": "هرمزگان", "capitalEn": "Bandar Abbas", "capitalFa": "بندرعباس", "lat": 27.1832, "lon": 56.2666, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.5, "batteryCapKwh": 36.0, "minSocKwh": 7.17, "springTilt": 16, "summerTilt": 16, "autumnTilt": 51, "winterTilt": 44, "annualTilt": 27},
    {"nameEn": "Markazi", "nameFa": "مرکزی", "capitalEn": "Arak", "capitalFa": "اراک", "lat": 34.0917, "lon": 49.6892, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 11, "summerTilt": 20, "autumnTilt": 58, "winterTilt": 49, "annualTilt": 33},
    {"nameEn": "Ardabil", "nameFa": "اردبیل", "capitalEn": "Ardabil", "capitalFa": "اردبیل", "lat": 38.2498, "lon": 48.2933, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 34.0, "minSocKwh": 7.17, "springTilt": 7, "summerTilt": 24, "autumnTilt": 62, "winterTilt": 53, "annualTilt": 37},
    {"nameEn": "South Khorasan", "nameFa": "خراسان جنوبی", "capitalEn": "Birjand", "capitalFa": "بیرجند", "lat": 32.8649, "lon": 59.2262, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.2, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 12, "summerTilt": 20, "autumnTilt": 56, "winterTilt": 49, "annualTilt": 32},
    {"nameEn": "North Khorasan", "nameFa": "خراسان شمالی", "capitalEn": "Bojnord", "capitalFa": "بجنورد", "lat": 37.4747, "lon": 57.3290, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 33.0, "minSocKwh": 7.17, "springTilt": 8, "summerTilt": 23, "autumnTilt": 61, "winterTilt": 52, "annualTilt": 36},
    {"nameEn": "Bushehr", "nameFa": "بوشهر", "capitalEn": "Bushehr", "capitalFa": "بوشهر", "lat": 28.9234, "lon": 50.8203, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.4, "batteryCapKwh": 35.0, "minSocKwh": 7.17, "springTilt": 15, "summerTilt": 17, "autumnTilt": 52, "winterTilt": 45, "annualTilt": 28},
    {"nameEn": "Golestan", "nameFa": "گلستان", "capitalEn": "Gorgan", "capitalFa": "گرگان", "lat": 36.8427, "lon": 54.4439, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 31.0, "minSocKwh": 7.17, "springTilt": 8, "summerTilt": 22, "autumnTilt": 60, "winterTilt": 51, "annualTilt": 35},
    {"nameEn": "Qazvin", "nameFa": "قزوین", "capitalEn": "Qazvin", "capitalFa": "قزوین", "lat": 36.2688, "lon": 50.0041, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 32.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 22, "autumnTilt": 60, "winterTilt": 51, "annualTilt": 35},
    {"nameEn": "Semnan", "nameFa": "سمنان", "capitalEn": "Semnan", "capitalFa": "سمنان", "lat": 35.5729, "lon": 53.3971, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.2, "batteryCapKwh": 33.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 21, "autumnTilt": 59, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Chaharmahal & Bakhtiari", "nameFa": "چهارمحال و بختیاری", "capitalEn": "Shahrekord", "capitalFa": "شهرکرد", "lat": 32.3256, "lon": 50.8644, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 12, "summerTilt": 20, "autumnTilt": 56, "winterTilt": 49, "annualTilt": 32},
    {"nameEn": "Mazandaran", "nameFa": "مازندران", "capitalEn": "Sari", "capitalFa": "ساری", "lat": 36.5633, "lon": 53.0601, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 4.8, "batteryCapKwh": 30.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 22, "autumnTilt": 60, "winterTilt": 51, "annualTilt": 35},
    {"nameEn": "Kurdistan", "nameFa": "کردستان", "capitalEn": "Sanandaj", "capitalFa": "سنندج", "lat": 35.3219, "lon": 46.9862, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 33.5, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 21, "autumnTilt": 59, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Qom", "nameFa": "قم", "capitalEn": "Qom", "capitalFa": "قم", "lat": 34.6401, "lon": 50.8764, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.2, "batteryCapKwh": 33.0, "minSocKwh": 7.17, "springTilt": 10, "summerTilt": 21, "autumnTilt": 58, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "West Azerbaijan", "nameFa": "آذربایجان غربی", "capitalEn": "Urmia", "capitalFa": "ارومیه", "lat": 37.5527, "lon": 45.0761, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 33.5, "minSocKwh": 7.17, "springTilt": 8, "summerTilt": 23, "autumnTilt": 61, "winterTilt": 52, "annualTilt": 36},
    {"nameEn": "Kermanshah", "nameFa": "کرمانشاه", "capitalEn": "Kermanshah", "capitalFa": "کرمانشاه", "lat": 34.3142, "lon": 47.0650, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 34.0, "minSocKwh": 7.17, "springTilt": 10, "summerTilt": 21, "autumnTilt": 58, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Sistan & Baluchestan", "nameFa": "سیستان و بلوچستان", "capitalEn": "Zahedan", "capitalFa": "زاهدان", "lat": 29.4963, "lon": 60.8629, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.5, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 14, "summerTilt": 18, "autumnTilt": 53, "winterTilt": 46, "annualTilt": 29},
    {"nameEn": "Hamadan", "nameFa": "همدان", "capitalEn": "Hamadan", "capitalFa": "همدان", "lat": 34.7982, "lon": 48.5146, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.0, "minSocKwh": 7.17, "springTilt": 10, "summerTilt": 21, "autumnTilt": 58, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Kohgiluyeh & Boyer-Ahmad", "nameFa": "کهگیلویه و بویراحمد", "capitalEn": "Yasuj", "capitalFa": "یاسوج", "lat": 30.6682, "lon": 51.5880, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.2, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 13, "summerTilt": 19, "autumnTilt": 55, "winterTilt": 48, "annualTilt": 31},
    {"nameEn": "Ilam", "nameFa": "ایلام", "capitalEn": "Ilam", "capitalFa": "ایلام", "lat": 33.6374, "lon": 46.4227, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 35.0, "minSocKwh": 7.17, "springTilt": 11, "summerTilt": 20, "autumnTilt": 57, "winterTilt": 49, "annualTilt": 33},
    {"nameEn": "Zanjan", "nameFa": "زنجان", "capitalEn": "Zanjan", "capitalFa": "زنجان", "lat": 36.6736, "lon": 48.4787, "baseLoad": 1.16, "nightLoad": 1.98, "pvCapacityKw": 5.0, "batteryCapKwh": 33.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 22, "autumnTilt": 60, "winterTilt": 51, "annualTilt": 35},
    {"nameEn": "Alborz", "nameFa": "البرز", "capitalEn": "Karaj", "capitalFa": "کرج", "lat": 35.8400, "lon": 50.9391, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 32.0, "minSocKwh": 7.17, "springTilt": 9, "summerTilt": 21, "autumnTilt": 59, "winterTilt": 50, "annualTilt": 34},
    {"nameEn": "Lorestan", "nameFa": "لرستان", "capitalEn": "Khorramabad", "capitalFa": "خرم‌آباد", "lat": 33.4878, "lon": 48.3558, "baseLoad": 1.25, "nightLoad": 1.80, "pvCapacityKw": 5.0, "batteryCapKwh": 35.8, "minSocKwh": 7.17, "springTilt": 11, "summerTilt": 20, "autumnTilt": 57, "winterTilt": 49, "annualTilt": 33}
]

SEASONS = [
    {"name": "Spring", "nameFa": "بهار", "date": "5 May", "dayOfYear": 125, "declinationDeg": 16.3},
    {"name": "Summer", "nameFa": "تابستان", "date": "6 Aug", "dayOfYear": 218, "declinationDeg": 16.6},
    {"name": "Autumn", "nameFa": "پاییز", "date": "6 Nov", "dayOfYear": 310, "declinationDeg": -16.0},
    {"name": "Winter", "nameFa": "زمستان", "date": "4 Feb", "dayOfYear": 35, "declinationDeg": -16.2}
]

def calculate_solar_point(province, season, hour):
    lat = province["lat"]
    lon = province["lon"]
    dec = math.radians(season["declinationDeg"])
    lat_rad = math.radians(lat)
    
    # Solar time adjustment from UTC+3.5
    # Solar noon is around 12:00 + (52.5 - lon)*4 / 60
    lstm = 52.5 # Iran standard meridian (UTC+3.5)
    time_offset = (lon - lstm) * 4 / 60.0
    solar_hour = hour + time_offset
    hour_angle = math.radians((solar_hour - 12.0) * 15.0)
    
    # Solar elevation (altitude)
    sin_alt = math.sin(lat_rad) * math.sin(dec) + math.cos(lat_rad) * math.cos(dec) * math.cos(hour_angle)
    sin_alt = max(-1.0, min(1.0, sin_alt))
    alt_rad = math.asin(sin_alt)
    alt_deg = math.degrees(alt_rad)
    
    # Solar azimuth (measured from North clockwise, South = 180)
    cos_az = (math.sin(dec) - math.sin(lat_rad) * math.sin(alt_rad)) / (math.cos(lat_rad) * math.cos(alt_rad) + 1e-9)
    cos_az = max(-1.0, min(1.0, cos_az))
    az_from_south = math.acos(cos_az)
    if hour_angle > 0:
        az_deg = 180.0 + math.degrees(az_from_south)
    else:
        az_deg = 180.0 - math.degrees(az_from_south)
    az_deg = az_deg % 360.0

    # Irradiance model (Perez/ASHRAE clean sky for high-solar Iran plateau)
    if alt_deg > 0:
        air_mass = 1.0 / (math.sin(alt_rad) + 0.50572 * math.pow(alt_deg + 6.07995, -1.6364))
        # Direct normal irradiance
        dni = 940.0 * math.exp(-0.16 * air_mass)
        # Diffuse horizontal
        dhi = 0.12 * dni * math.sin(alt_rad) + 25.0
        # Global horizontal
        ghi = dni * math.sin(alt_rad) + dhi
        
        # Dual-axis tracker perfectly aligns perpendicular to sun rays (AOI = 0)
        poa_tracked = dni + dhi * (1.0 + math.cos(math.radians(90 - alt_deg))) / 2.0
        
        # Fixed optimal tilt (annual average)
        fixed_tilt = math.radians(province["annualTilt"])
        cos_aoi_fixed = math.sin(alt_rad) * math.cos(fixed_tilt) + math.cos(alt_rad) * math.sin(fixed_tilt) * math.cos(math.radians(az_deg - 180))
        cos_aoi_fixed = max(0.0, cos_aoi_fixed)
        poa_fixed = dni * cos_aoi_fixed + dhi * (1.0 + math.cos(fixed_tilt)) / 2.0
        poa_horizontal = ghi
        
        opt_tilt_deg = max(0.0, min(85.0, 90.0 - alt_deg))
        opt_az_deg = az_deg
        rig_rotZ_deg = 180.0 - az_deg
        rig_rotX_deg = opt_tilt_deg
        aoi_deg = 0.0
    else:
        dni = 0.0
        dhi = 0.0
        ghi = 0.0
        poa_tracked = 0.0
        poa_fixed = 0.0
        poa_horizontal = 0.0
        opt_tilt_deg = 0.0
        opt_az_deg = 180.0
        rig_rotZ_deg = 0.0
        rig_rotX_deg = 0.0
        aoi_deg = 0.0

    # Building PV System (5kW system with inverter efficiency ~88%)
    pv_kw = (province["pvCapacityKw"] * (poa_tracked / 1000.0) * 0.88) if alt_deg > 0 else 0.0
    
    # Load profile (lighting/appliances)
    if hour >= 18 or hour <= 6:
        load_kw = province["nightLoad"] if (hour >= 20 or hour <= 4) else (province["nightLoad"] * 0.8)
    else:
        load_kw = province["baseLoad"]
        
    return {
        "alt_deg": round(alt_deg, 2),
        "az_deg": round(az_deg, 2),
        "dni": round(dni, 1),
        "dhi": round(dhi, 1),
        "ghi": round(ghi, 1),
        "opt_tilt_deg": round(opt_tilt_deg, 2),
        "opt_az_deg": round(opt_az_deg, 2),
        "rig_rotZ_deg": round(rig_rotZ_deg, 2),
        "rig_rotX_deg": round(rig_rotX_deg, 2),
        "aoi_deg": round(aoi_deg, 2),
        "poa_tracked": round(poa_tracked, 1),
        "poa_fixed": round(poa_fixed, 1),
        "poa_horizontal": round(poa_horizontal, 1),
        "pv_kw": round(pv_kw, 2),
        "load_kw": round(load_kw, 2)
    }

# Run simulation and microgrid energy balance across 24h
all_rows = []
provinces_summary = []

for prov in PROVINCES:
    prov_data = {
        "nameEn": prov["nameEn"],
        "nameFa": prov["nameFa"],
        "capitalEn": prov["capitalEn"],
        "capitalFa": prov["capitalFa"],
        "lat": prov["lat"],
        "lon": prov["lon"],
        "optimalTilt": {
            "spring": prov["springTilt"],
            "summer": prov["summerTilt"],
            "autumn": prov["autumnTilt"],
            "winter": prov["winterTilt"],
            "annual": prov["annualTilt"]
        },
        "annualPvMwh": 0.0,
        "trackedGainPct": 0.0,
        "selfSufficiencyPct": 0.0,
        "batteryAutonomyHours": round(prov["batteryCapKwh"] / (prov["baseLoad"] + 0.1), 1),
        "seasons": {}
    }
    
    total_tracked_poa = 0.0
    total_fixed_poa = 0.0
    total_gen_kwh = 0.0
    total_load_kwh = 0.0
    total_grid_import_kwh = 0.0

    for season in SEASONS:
        season_rows = []
        # Battery state tracking
        soc = prov["batteryCapKwh"] * 0.65 # Initial 65% SoC
        max_soc = prov["batteryCapKwh"]
        min_soc = prov["minSocKwh"]
        
        # Run 24 hours
        for h in range(24):
            sp = calculate_solar_point(prov, season, h)
            pv_kw = sp["pv_kw"]
            load_kw = sp["load_kw"]
            net_power = pv_kw - load_kw # positive = surplus, negative = deficit
            
            grid_import = 0.0
            battery_flow = 0.0 # positive = charging, negative = discharging
            mode = "night_discharging"
            
            if net_power > 0:
                # Excess solar generation
                charge_space = max_soc - soc
                battery_flow = min(net_power, charge_space, 4.0) # max 4kW charge rate
                soc += battery_flow * 0.95 # 95% charge efficiency
                soc = min(max_soc, soc)
                mode = "day_charging" if battery_flow > 0.05 else "day_idle"
            else:
                # Deficit
                deficit = abs(net_power)
                if sp["alt_deg"] > 0:
                    mode = "day_discharging"
                else:
                    mode = "night_discharging"
                    
                available_discharge = max(0.0, soc - min_soc)
                discharge = min(deficit, available_discharge, 4.0) # max 4kW discharge
                battery_flow = -discharge
                soc -= discharge / 0.95
                soc = max(min_soc, soc)
                
                unmet = deficit - discharge
                if unmet > 0.01:
                    grid_import = unmet
                    if sp["alt_deg"] <= 0 and soc <= min_soc + 0.1:
                        mode = "night_idle"

            soc = round(soc, 2)
            battery_flow = round(battery_flow, 2)
            grid_import = round(grid_import, 2)
            
            total_tracked_poa += sp["poa_tracked"]
            total_fixed_poa += sp["poa_fixed"]
            total_gen_kwh += pv_kw
            total_load_kwh += load_kw
            total_grid_import_kwh += grid_import
            
            row = [
                prov["nameEn"], prov["capitalEn"], prov["lat"], prov["lon"],
                season["name"], season["date"], h,
                sp["alt_deg"], sp["az_deg"], sp["dni"], sp["dhi"], sp["ghi"],
                sp["opt_tilt_deg"], sp["opt_az_deg"], sp["rig_rotZ_deg"], sp["rig_rotX_deg"],
                sp["aoi_deg"], sp["poa_tracked"], sp["poa_fixed"], sp["poa_horizontal"],
                sp["pv_kw"], sp["load_kw"], battery_flow, soc, grid_import, mode
            ]
            all_rows.append(row)
            season_rows.append({
                "hour": h,
                "alt": sp["alt_deg"],
                "az": sp["az_deg"],
                "dni": sp["dni"],
                "dhi": sp["dhi"],
                "ghi": sp["ghi"],
                "optTilt": sp["opt_tilt_deg"],
                "optAz": sp["opt_az_deg"],
                "rigRotZ": sp["rig_rotZ_deg"],
                "rigRotX": sp["rig_rotX_deg"],
                "aoi": sp["aoi_deg"],
                "poaTracked": sp["poa_tracked"],
                "poaFixed": sp["poa_fixed"],
                "poaHorizontal": sp["poa_horizontal"],
                "pvKw": sp["pv_kw"],
                "loadKw": sp["load_kw"],
                "batteryFlowKw": battery_flow,
                "batterySocKwh": soc,
                "gridImportKw": grid_import,
                "mode": mode
            })
            
        prov_data["seasons"][season["name"].lower()] = season_rows

    tracked_gain = ((total_tracked_poa - total_fixed_poa) / (total_fixed_poa + 1e-9)) * 100.0
    self_suff = ((total_load_kwh - total_grid_import_kwh) / (total_load_kwh + 1e-9)) * 100.0
    annual_mwh = (total_gen_kwh / 4.0 * 365.25) / 1000.0
    
    prov_data["annualPvMwh"] = round(annual_mwh, 2)
    prov_data["trackedGainPct"] = round(tracked_gain, 1)
    prov_data["selfSufficiencyPct"] = round(self_suff, 1)
    provinces_summary.append(prov_data)

# Write full CSV to public directory
header = [
    "province","capital","lat","lon","season","date","hour",
    "sun_alt_deg","sun_az_deg","dni_wm2","dhi_wm2","ghi_wm2",
    "opt_tilt_deg","opt_az_deg","rig_rotZ_deg","rig_rotX_deg","aoi_deg",
    "poa_tracked_wm2","poa_fixed_wm2","poa_horizontal_wm2",
    "building_pv_kw","load_kw","battery_flow_kw","battery_soc_kwh","grid_import_kw","mode"
]

os.makedirs("public/data", exist_ok=True)
with open("public/data/iran_solar_simulation.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(all_rows)

print(f"Generated CSV with {len(all_rows)} rows across 31 provinces.")

# Write TypeScript data module
ts_content = f"""/**
 * Iran Solar Tracker & Microgrid Simulation Dataset
 * Contains astronomical, solar radiation, dual-axis tracking rig, and battery storage data for 31 Iranian provinces.
 */

export interface HourlySolarPoint {{
  hour: number;
  alt: number;
  az: number;
  dni: number;
  dhi: number;
  ghi: number;
  optTilt: number;
  optAz: number;
  rigRotZ: number;
  rigRotX: number;
  aoi: number;
  poaTracked: number;
  poaFixed: number;
  poaHorizontal: number;
  pvKw: number;
  loadKw: number;
  batteryFlowKw: number;
  batterySocKwh: number;
  gridImportKw: number;
  mode: 'night_discharging' | 'day_discharging' | 'day_charging' | 'day_idle' | 'night_idle';
}}

export interface ProvinceSolarData {{
  nameEn: string;
  nameFa: string;
  capitalEn: string;
  capitalFa: string;
  lat: number;
  lon: number;
  optimalTilt: {{
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
    annual: number;
  }};
  annualPvMwh: number;
  trackedGainPct: number;
  selfSufficiencyPct: number;
  batteryAutonomyHours: number;
  seasons: {{
    spring: HourlySolarPoint[];
    summer: HourlySolarPoint[];
    autumn: HourlySolarPoint[];
    winter: HourlySolarPoint[];
  }};
}}

export const PROVINCES_DATA: ProvinceSolarData[] = {json.dumps(provinces_summary, ensure_ascii=False, indent=2)};

export const SEASONS_LIST = [
  {{ id: 'spring', nameEn: 'Spring', nameFa: 'بهار', dateFa: '۱۵ اردیبهشت (5 May)', color: '#10b981' }},
  {{ id: 'summer', nameEn: 'Summer', nameFa: 'تابستان', dateFa: '۱۵ مرداد (6 Aug)', color: '#f59e0b' }},
  {{ id: 'autumn', nameEn: 'Autumn', nameFa: 'پاییز', dateFa: '۱۵ آبان (6 Nov)', color: '#f97316' }},
  {{ id: 'winter', nameEn: 'Winter', nameFa: 'زمستان', dateFa: '۱۵ بهمن (4 Feb)', color: '#0284c7' }}
];
"""

with open("src/data/provincesData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Saved src/data/provincesData.ts successfully.")
