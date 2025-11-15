from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

# --- THIS BLOCK IS CHANGED ---
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
# We now import our custom view from the users app
from users.views import MyTokenObtainPairView
# --- END OF CHANGE ---

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/auth/', include('users.urls')),
    
    # --- THIS LINE IS CHANGED ---
    # It now points to our new, custom view
    path('api/auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # These two are unchanged
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)