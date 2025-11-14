# backend/src/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, StaffProfile

class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'
    extra = 0 

class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False
    verbose_name_plural = 'Staff Profile'
    extra = 0

class CustomUserAdmin(UserAdmin):
    inlines = (StudentProfileInline, StaffProfileInline)
    
    list_display = ('email', 'role', 'is_approved', 'is_staff', 'is_superuser')
    
    list_filter = ('role', 'is_approved', 'is_staff', 'is_superuser')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_approved', 'role', 'groups'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2', 'role', 'is_approved', 'is_staff', 'is_superuser'),
        }),
    )
    
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)