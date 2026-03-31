from django.urls import path
from .views import live_location_data

urlpatterns = [
    path("live-data/", live_location_data, name="live-location-data"),
]