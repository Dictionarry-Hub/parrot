"""
Utility functions for parsing and normalizing author names.
"""

def parse_author_name(name: str) -> str:
    """
    Parse author names and apply specific conversions.
    Case-insensitive matching is applied for all comparisons.
    
    Args:
        name: The original author name
        
    Returns:
        The parsed author name with any specific conversions applied
    """
    # Convert specific author names (lowercase keys for case-insensitive matching)
    name_mappings = {
        "sam chau": "santiagosayshey",
        "samuel chau": "santiagosayshey",
    }
    
    # Check for exact matches (case insensitive)
    if name.lower() in name_mappings:
        return name_mappings[name.lower()]
        
    # Check for partial matches (case insensitive)
    for original, replacement in name_mappings.items():
        if original.lower() in name.lower():
            return replacement
            
    # Return the original name if no matches found
    return name