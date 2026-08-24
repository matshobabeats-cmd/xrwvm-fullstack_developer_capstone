from django.urls import path
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path(route='get_cars', view=views.get_cars, name='getcars'),
]
