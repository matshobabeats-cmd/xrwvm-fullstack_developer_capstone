from django.urls import path
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # User authentication routes
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),
    path(route='register', view=views.registration, name='register'),

    # Car routes
    path(route='get_cars', view=views.get_cars, name='getcars'),

    # Dealership routes
    path(route='get_dealers', view=views.get_dealers, name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealers, name='get_dealers_by_state'),
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),

    # Review routes
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews'),
    path(route='add_review', view=views.add_review, name='add_review'),
]