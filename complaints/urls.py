from django.urls import path
from . import views

urlpatterns = [
    path("register-complaint/", views.register_complaint, name="register_complaint"),
    path("", views.home, name="home"),
    path("complaint/<int:id>/", views.complaint_detail, name="complaint_detail"),
    path("complaint/<int:id>/update-status/", views.update_status, name="update_status"),
    path("track/", views.track_complaint, name="track_complaint"),
]