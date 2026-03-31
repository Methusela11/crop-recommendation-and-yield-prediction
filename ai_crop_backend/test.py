import rasterio

def get_soil_ph_10cm(lat, lon, raster_path="soil_ph_10cm_kenya.tif"):
    """
    Returns soil pH (0-14 scale) at 10cm depth for a given lat/lon.
    """
    with rasterio.open(raster_path) as src:
        # rasterio.sample expects (lon, lat)
        value = list(src.sample([(lon, lat)]))[0][0]
        
        if value is None:
            return None
        
        # OpenLandMap stores pH as ×10, so divide by 10
        ph = value / 10
        return round(ph, 2)

locations = {
    "Nakuru": (-0.3031, 36.0800),
    "Mandera": (3.9376, 41.8641),
    "Kilifi": (-3.6333, 39.8500),
    "Busia": (0.4553, 34.1200),
    "Kakamega": (0.2823, 34.7519),
    "Kericho": (-0.3686, 35.2833),
}

for county, (lat, lon) in locations.items():
    ph = get_soil_ph_10cm(lat, lon)
    print(f"Soil pH at 10cm in {county}: {ph}")