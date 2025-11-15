from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
# --- ADD THESE IMPORTS ---
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
# --- END IMPORTS ---
from .models import User
from .serializers import (
    StudentSignUpSerializer, 
    StaffSignUpSerializer, 
    UserSerializer
)

# --- NEW VIEW (ADD THIS) ---
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view to use our custom serializer.
    """
    serializer_class = MyTokenObtainPairSerializer
# --- END OF NEW VIEW ---


class StudentSignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = StudentSignUpSerializer
    parser_classes = (MultiPartParser, FormParser)

class StaffSignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = StaffSignUpSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)