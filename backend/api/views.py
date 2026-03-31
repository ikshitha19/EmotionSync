from rest_framework.views import APIView
from rest_framework.response import Response
from .nlp_engine import analyze_emotion, generate_agent_response

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
