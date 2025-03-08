"""
Utility function to return random funny footer messages from a pirate parrot's perspective.
"""
import random


def get_random_footer() -> str:
    """
    Returns a random funny footer message from the perspective of a snarky pirate parrot.
    
    Returns:
        A string containing a random funny message
    """
    messages = [
        "Profilarr!? I barely know arr!!",
        
        "SQUAWK! Just spent 3 hours calculating the Golden Popcorn Performance Index for a movie " 
        "I'll watch while doom-scrolling on my phone anyway.",
        
        "Only an *arr user would create a 47-page wiki explaining why TrueHD Atmos is superior " 
        "to DD+ Atmos while watching everything on TV speakers at 30% volume to avoid waking the baby.",
        
        "KRAAK! And you thought this commit was OCD? You should see Seraphys renaming " 
        "all his custom formats for the 5th time this week!",
        
        "POLLY WANTS A MERGE CONFLICT! Just kidding, no one wants a merge conflict. " 
        "Especially not after you modified that regex pattern by one character.",
        
        "Using k-means clustering to organize release groups but can't organize the " 
        "cables behind my TV. Priorities, am I right?",
        
        "Calculating Encode Efficiency Index metrics while ignoring the efficiency of my own life choices. " 
        "We all need ther(arr)py.",
        
        "My compression ratio is 40%, but my sanity ratio after maintaining these " 
        "custom formats is down to 10%.",
        
        "Spent 2 hours perfecting a regex pattern to detect 'upscaled multi-language dual-layer anime encodes' " 
        "that I'll encounter exactly once in my lifetime. This is fine.",
        
        "AWK! Created 16 quality tiers to ensure I get the perfect encode, only to watch it on my " 
        "iPhone because I spent my 4K TV budget on hard drives.",
        
        "When your 'Must Include Original Language' filter means you download a German film but " 
        "still can't understand a word. Wunderbar!",
        
        "Nobody: ... Absolutely nobody: ... Me: Let me explain why this 55% compression ratio is " 
        "objectively better than 60% through 32 slides of VMAF analysis.",
        
        "SQUAWK! Meticulously configured my Special Edition custom format to prefer the Director's Cut, " 
        "then fell asleep 20 minutes into the extended 4-hour version.",
        
        "CHIRP! Spent all day debating if AV1 is the future, meanwhile my parrot cage is still " 
        "stuck in the past. Haven't cleaned it in weeks.",
    ]
    
    return random.choice(messages)