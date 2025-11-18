# backend/src/users/serializers.py

from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, StudentProfile, StaffProfile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to add our 'is_approved' check.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_approved:
            raise serializers.ValidationError(
                {"detail": "Account not yet approved by admin. Please wait for approval."}
            )
        
        return data

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['student_id', 'department_name', 'father_name', 'mother_name', 'phone_number', 'photo', 'id_card']

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ['staff_id', 'phone_number']

class StudentSignUpSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(write_only=True, required=True)
    department_name = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(write_only=True, required=True)
    father_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    mother_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    photo = serializers.ImageField(write_only=True, required=True)
    id_card = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'student_id', 'department_name', 'phone_number',
            'father_name', 'mother_name', 'photo', 'id_card'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    @transaction.atomic
    def create(self, validated_data):
        profile_data = {
            'student_id': validated_data.pop('student_id'),
            'department_name': validated_data.pop('department_name'),
            'phone_number': validated_data.pop('phone_number'),
            'father_name': validated_data.pop('father_name', ''),
            'mother_name': validated_data.pop('mother_name', ''),
            'photo': validated_data.pop('photo'),
            'id_card': validated_data.pop('id_card'),
        }
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=User.Role.STUDENT
        )
        
        StudentProfile.objects.create(
            user=user,
            **profile_data
        )
        
        return user

class StaffSignUpSerializer(serializers.ModelSerializer):
    profile = StaffProfileSerializer(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'profile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    @transaction.atomic
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=User.Role.STAFF
        )
        StaffProfile.objects.create(
            user=user,
            **profile_data
        )
        
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_approved']