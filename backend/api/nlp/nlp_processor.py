from textblob import TextBlob
from deep_translator import GoogleTranslator

class NLPProcessor:
    """
    Handles linguistic preprocessing, translation, and sentiment analysis.
    Uses TextBlob for raw stats and deep_translator for multilingual support.
    """
    
    def process(self, text, language='en'):
        # 1. Translation
        processed_text = text
        if language == 'te':
            try:
                processed_text = GoogleTranslator(source='te', target='en').translate(text)
            except Exception:
                pass
        
        # 2. Linguistic Analysis
        blob = TextBlob(processed_text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        noun_phrases = list(blob.noun_phrases)
        
        return {
            'translated_text': processed_text,
            'polarity': polarity,
            'subjectivity': subjectivity,
            'noun_phrases': noun_phrases
        }

    def back_translate(self, text, language='en'):
        if language == 'te':
            try:
                return GoogleTranslator(source='en', target='te').translate(text)
            except Exception:
                pass
        return text
