from django.urls import path
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),
    path(route='register', view=views.registration, name='register'),
]