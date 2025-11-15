# backend/src/users/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"
        STAFF = "STAFF", "Kitchen Staff"

    username = None
    email = models.EmailField(_("email address"), unique=True)
    
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.ADMIN)

    is_approved = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    student_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    department_name = models.CharField(max_length=100, blank=True, null=True)
    father_name = models.CharField(max_length=100, blank=True, null=True)
    mother_name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    
    photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)
    id_card = models.ImageField(upload_to='student_id_cards/', blank=True, null=True)

    def __str__(self):
        return self.user.email

class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    staff_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    photo = models.ImageField(upload_to='staff_photos/', blank=True, null=True)

    def __str__(self):
        return self.user.email