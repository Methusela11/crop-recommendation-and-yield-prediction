from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import (
    get_weather_data,
    get_soil_temperature,
    get_location_info,
    fetch_soil_data,
    get_recommended_crops,
    get_monthly_weather_averages,
    get_4_month_forecast,
)


@api_view(['GET'])
def live_location_data(request):
    lat = request.query_params.get("lat")
    lon = request.query_params.get("lon")

    if not lat or not lon:
        return Response({"error": "Latitude and longitude required"}, status=400)

    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    # ------------------ WEATHER ------------------
    weather = get_weather_data(lat, lon)

    # ------------------ MONTHLY WEATHER ------------------
    monthly = get_monthly_weather_averages(lat, lon)

    forecast_4 = get_4_month_forecast(lat, lon)
    weather["forecast_4_months"] = forecast_4


    weather["avg_temp_month"] = monthly.get("avg_temp_month", 25)
    weather["rainfall_mm_per_month"] = monthly.get("rainfall_mm_per_month", 100)

    # ------------------ FORECAST ------------------
    weather["forecast"] = get_4_month_forecast(lat, lon)

    # ------------------ OPTIONAL: fallback rainfall ------------------
    # Only use precipitation if monthly failed
    if weather["rainfall_mm_per_month"] == 0 and weather.get("precipitation") is not None:
        weather["rainfall_mm_per_month"] = round(weather["precipitation"] * 30 * 5, 2)
        # (assumes ~5 rainy hours/day, more realistic)

    # ------------------ SOIL ------------------
    soil_data = fetch_soil_data(lat, lon)
    soil_ph = soil_data.get("soil_ph", 6.5)  # safe default

    weather["soil_temperature"] = get_soil_temperature(
        lat, lon, weather.get("avg_temp_month")
    )
    weather.update(soil_data)

    # ------------------ LOCATION ------------------
    weather["city"] = get_location_info(lat, lon)

    # ------------------ CROP RECOMMENDATION ------------------
    if forecast_4:
        avg_temp_4 = sum(m["temp"] for m in forecast_4) / len(forecast_4)
        avg_rain_4 = sum(m["rainfall"] for m in forecast_4) / len(forecast_4)
        avg_humidity_4 = sum(m["humidity"] for m in forecast_4) / len(forecast_4)

    weather["avg_temp_month"] = round(avg_temp_4, 2)
    weather["rainfall_mm_per_month"] = round(avg_rain_4, 2)
    weather["humidity"] = round(avg_humidity_4, 2)
    weather["recommended_crops"] = get_recommended_crops(
        forecast_4,
        soil_ph,
    )
    return Response(weather)