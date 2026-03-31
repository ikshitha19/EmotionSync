from django.urls import path
from .views import AnalyzeEmotionView

urlpatterns = [
    path('analyze', AnalyzeEmotionView.as_view(), name='analyze_emotion'),
]
