# backend/src/users/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('register/student/', views.StudentSignUpView.as_view(), name='student-signup'),
    path('register/staff/', views.StaffSignUpView.as_view(), name='staff-signup'),
    
    path('me/', views.UserDetailView.as_view(), name='user-detail'),
]