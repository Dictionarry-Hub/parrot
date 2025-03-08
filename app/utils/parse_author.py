"""
Utility functions for parsing and normalizing author names.
"""

def parse_author_name(name: str) -> str:
    """
    Parse author names and apply specific conversions.
    
    Args:
        name: The original author name
        
    Returns:
        The parsed author name with any specific conversions applied
    """
    # Convert specific author names
    name_mappings = {
        "Sam Chau": "santiagosayshey",
        "Samuel Chau": "santiagosayshey",
    }
    
    # Check for exact matches first
    if name in name_mappings:
        return name_mappings[name]
        
    # Check for partial matches (case insensitive)
    for original, replacement in name_mappings.items():
        if original.lower() in name.lower():
            return replacement
            
    # Return the original name if no matches found
    return name