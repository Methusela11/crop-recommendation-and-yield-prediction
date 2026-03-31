import requests
import os
import json
from typing import Dict, List

OPENWEATHER_KEY = "0aad1cf5ea8830746c20fdc9bc43d2db"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load Crop dataset
with open(os.path.join(BASE_DIR, "api", "data", "Crop_recommendation.json"), "r") as f:
    CROP_DATA = json.load(f)


# ------------------ WEATHER ------------------
def get_weather_data(lat: float, lon: float) -> Dict:
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        precipitation = 0
        if "rain" in data:
            precipitation = data["rain"].get("1h", 0)
        elif "snow" in data:
            precipitation = data["snow"].get("1h", 0)

        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "precipitation": precipitation,
            "weather_icon": f"http://openweathermap.org/img/wn/{data['weather'][0]['icon']}@2x.png",
        }
    except Exception as e:
        print(f"Weather API failed: {e}")
        return {
            "temperature": None,
            "humidity": None,
            "wind_speed": None,
            "precipitation": None,
            "weather_icon": None,
        }


# ------------------ SOIL ------------------
def get_soil_temperature(lat: float, lon: float, air_temp: float) -> float:
    """Fallback soil temperature = air_temp - 2°C"""
    return round(air_temp - 2, 1) if air_temp is not None else 20.0


import rasterio

def fetch_soil_data(lat: float, lon: float):
    try:
        url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&property=phh2o&depth=5-15cm&value=mean"
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        ph_raw = data["properties"]["layers"][0]["depths"][0]["values"]["mean"]
        ph = ph_raw / 10
        return {"soil_ph": round(ph, 2)}
    except Exception as e:
        print(f"Soil API failed: {e}")
        # fallback to local raster
        try:
            raster_path = "soil_ph_10cm_kenya.tif"
            with rasterio.open(raster_path) as src:
                value = list(src.sample([(lon, lat)]))[0][0]
                ph = value / 10 if value is not None else None
                return {"soil_ph": round(ph, 2) if ph else None}
        except Exception as e2:
            print(f"Raster fallback failed: {e2}")
            return {"soil_ph": None}

# ------------------ LOCATION ------------------
def get_location_info(lat: float, lon: float) -> str:
    """Reverse geocode coordinates to 'Ward/Constituency, County'"""
    try:
        url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={OPENWEATHER_KEY}"
        res = requests.get(url, timeout=5)
        res.raise_for_status()
        data = res.json()
        if not data:
            return "Unknown"

        loc = data[0]
        ward = loc.get("subregion") or loc.get("name") or None
        county = loc.get("state") or None
        parts = [p for p in [ward, county] if p]
        return ", ".join(parts) if parts else "Unknown"

    except Exception as e:
        print(f"Reverse geocode failed: {e}")
        return "Unknown"


# ------------------ CROP RECOMMENDATION ------------------
# ------------------ CROP SCORING ------------------
def in_range_score(value, min_val, max_val, weight):
    """
    Returns full weight if inside range,
    otherwise decreases score based on distance.
    """
    if value is None:
        return 0

    if min_val <= value <= max_val:
        return weight

    # distance penalty
    diff = min(abs(value - min_val), abs(value - max_val))
    return max(0, weight - diff)


def score_crop_4_months(crop: Dict, forecast: List[Dict], soil_ph: float) -> float:
    score = 0
    total_checks = 0

    for month in forecast:
        # 🌡 Temperature
        if crop["temp_min"] <= month["temp"] <= crop["temp_max"]:
            score += 1
        total_checks += 1

        # 🌧 Rainfall
        if crop["rainfall_min"] <= month["rainfall"] <= crop["rainfall_max"]:
            score += 1
        total_checks += 1

        # 💧 Humidity
        if crop["humidity_min"] <= month["humidity"] <= crop["humidity_max"]:
            score += 1
        total_checks += 1

    # 🧪 Soil pH (once)
    if soil_ph is not None and crop["ph_min"] <= soil_ph <= crop["ph_max"]:
        score += 2  # give soil higher weight
        total_checks += 2

    # convert to percentage
    return (score / total_checks) * 100 if total_checks > 0 else 0


# ------------------ RECOMMENDATION ------------------
def get_recommended_crops(forecast: List[Dict], soil_ph: float, top_n=None):
    results = []

    for crop in CROP_DATA:
        score = score_crop_4_months(crop, forecast, soil_ph)

        results.append({
            "label": crop["label"],
            "category": crop["category"],
            "score": round(score, 2),
            "percentage": round(score, 1)
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    if top_n:
        return results[:top_n]

    return results

def get_monthly_weather_averages(lat: float, lon: float) -> Dict:
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        temps = []
        rain_total = 0

        for item in data["list"]:
            temps.append(item["main"]["temp"])

            rain = 0
            if "rain" in item and "3h" in item["rain"]:
                rain = item["rain"]["3h"]

            rain_total += rain

        avg_temp = sum(temps) / len(temps) if temps else None

        # 🌧 Improved rainfall logic
        if rain_total == 0:
            if lon < 36:
                rainfall_month = 140
            elif lon <= 38:
                rainfall_month = 100
            else:
                rainfall_month = 60
        else:
            rainfall_month = (rain_total / 5) * 30

        return {
            "avg_temp_month": round(avg_temp, 2) if avg_temp else 25,
            "rainfall_mm_per_month": round(rainfall_month, 2)
        }

    except Exception as e:
        print(f"Monthly weather failed: {e}")
        return {
            "avg_temp_month": 25,
            "rainfall_mm_per_month": 100
        }
    
from datetime import datetime, timedelta

def get_4_month_forecast(lat: float, lon: float):
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        if "list" not in data:
            return []

        # ✅ get daily averages (every 8th item ≈ 24h)
        daily = data["list"][::8]

        forecasts = []

        for i in range(4):
            base = daily[i] if i < len(daily) else daily[-1]

            # simulate month progression
            future_date = datetime.now() + timedelta(days=30 * i)

            # 🌡 simulate seasonal drift
            temp = base["main"]["temp"] - (i * 0.5)
            humidity = base["main"]["humidity"] - (i * 2)

            rainfall = 0
            if "rain" in base and "3h" in base["rain"]:
                rainfall = base["rain"]["3h"] * 8 * 30  # scale monthly

            forecasts.append({
                "month": future_date.strftime("%B"),
                "temp": round(temp, 1),
                "rainfall": round(rainfall, 1),
                "humidity": max(40, humidity)
            })

        return forecasts

    except Exception as e:
        print(f"4-month forecast failed: {e}")
        return []

    

