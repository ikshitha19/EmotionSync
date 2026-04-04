from rest_framework.views import APIView
from rest_framework.response import Response
from .nlp_engine import analyze_emotion, generate_agent_response
import time

# Simple in-memory tracker for online users
# In a production app, use Redis or a DB table
online_users = {} # {username: last_seen_timestamp}

def cleanup_online_users():
    global online_users
    now = time.time()
    # Remove users who haven't sent a heartbeat in the last 60 seconds
    online_users = {u: t for u, t in online_users.items() if now - t < 60}

class AnalyzeEmotionView(APIView):
    def post(self, request):
        data = request.data
        text = data.get('text', '')
        chat_history = data.get('chatHistory', [])
        active_agent = data.get('activeAgent', 'listener')

        language = data.get('language', 'en')

        if not text:
            return Response({'error': 'No text provided'}, status=400)

        # Process through NLP / LLM emulation
        emotion_stats = analyze_emotion(text, language)
        
        # Decide agent
        current_agent = emotion_stats.get('recommendedAgentId') or active_agent

        # Generate response
        response_content = generate_agent_response(current_agent, text, emotion_stats, chat_history, language)

        return Response({
            'stats': emotion_stats,
            'response': response_content,
            'currentAgent': current_agent
        })

class HeartbeatView(APIView):
    def post(self, request):
        username = request.data.get('username')
        if username:
            online_users[username] = time.time()
            cleanup_online_users()
            return Response({'status': 'ok', 'online_count': len(online_users)})
        return Response({'error': 'No username provided'}, status=400)

class GetOnlineCountView(APIView):
    def get(self, request):
        cleanup_online_users()
        return Response({'online_count': len(online_users)})

