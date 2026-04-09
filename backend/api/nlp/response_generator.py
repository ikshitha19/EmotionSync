import random

class ResponseGenerator:
    """
    Template-based generation engine with mirroring and topic integration.
    """
    
    AGENT_ACTIONS = {
        'calm': [
            "Take a deep breath. Inhale for 4, hold for 4, exhale for 6. Let's find your center.",
            "I can feel the tension in your words. Let's try to release that physical weight together.",
            "You don't have to carry it all right now. Just focus on this one breath."
        ],
        'listener': [
            "I'm listening with full attention. Please, tell me more about what's been on your mind.",
            "That sounds like a lot to handle. I'm here to hold this space for you as long as you need.",
            "Your feelings are completely valid. What part of this feels the heaviest right now?"
        ],
        'coach': [
            "Let's break this down into one small, actionable piece. What's the very first step?",
            "You have more strength than you realize. Let's turn this obstacle into a strategy.",
            "Focus on what you *can* influence today. Everything else can wait until we have a plan."
        ],
        'anchor': [
            "Focus on the physical space around you. Name three things you can see and two you can hear.",
            "You are grounded. You are safe. The storm of thoughts will pass, but you remain here.",
            "Let's bring your awareness back to the present moment. Feel the seat beneath you."
        ],
        'vent': [
            "Let it out. Don't hold back—this is a safe, judgment-free zone for your rawest thoughts.",
            "Say exactly what you've been wanting to shout. I'm here to absorb it all.",
            "It's okay to be frustrated. Tell me every detail that's bothering you."
        ],
        # ... and so on
    }

    TOPIC_RESPONSES = {
        'work': "Work should be a part of your life, not the weight of it. Boundaries are essential.",
        'school': "Academic pressure doesn't define your worth. Take it one assignment at a time.",
        'relationships': "Human connections are complex. Vulnerability is a strength, not a weakness.",
        'family': "Family dynamics carry deep history. It's okay to prioritize your own peace.",
        'health': "Your body is talking to you. Listen and be kind to yourself today.",
        'finances': "Financial stress is deeply unsettling, but a budget and a plan can help regain a sense of security.",
        'hobbies': "Immersing yourself in something you love is a powerful form of self-care.",
        'future': "The future is unwritten. While it's natural to feel uncertain, focusing on the next 'now' can help."
    }

    def generate(self, agent_id, stats, noun_phrases):
        """
        Creates a contextualized response using mirrored phrases and topic integration.
        """
        emotion = stats.get('emotion', 'Neutral')
        intensity = stats.get('intensity', 'Low')
        topic = stats.get('topic')
        
        response_parts = [f"[{agent_id.upper()} AGENT]"]
        
        # Mirroring (Contextualization)
        if noun_phrases:
            phrase = random.choice(noun_phrases)
            response_parts.append(f"Regarding '{phrase}', I'd like to dive deeper into how that makes you feel.")
        
        # Validation
        if emotion != 'Neutral':
            response_parts.append(f"I can feel the {intensity.lower()} levels of {emotion.lower()} in your words.")
        
        # Topic Guidance
        if topic and topic in self.TOPIC_RESPONSES:
            response_parts.append(self.TOPIC_RESPONSES[topic])
            
        # Agent specialist advice
        base_actions = self.AGENT_ACTIONS.get(agent_id, ["I'm listening closely. Please continue sharing."])
        response_parts.append(random.choice(base_actions))

        return " ".join(response_parts).strip()
