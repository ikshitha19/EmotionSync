from django.urls import path
from .views import AnalyzeEmotionView, HeartbeatView, GetOnlineCountView

urlpatterns = [
    path('analyze', AnalyzeEmotionView.as_view(), name='analyze_emotion'),
    path('heartbeat', HeartbeatView.as_view(), name='heartbeat'),
    path('online-count', GetOnlineCountView.as_view(), name='online_count'),
]
