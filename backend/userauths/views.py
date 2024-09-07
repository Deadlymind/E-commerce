from django.shortcuts import render

from rest_framework_simplejwt.views import TokenObtainPairView

from userauths.models import User, Profile
from .serializer import UserSerializer, ProfileSerializer, MyTokenObtainPairSerializer, RegisterSerializer

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer