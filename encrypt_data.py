import os
import base64

data_dir = r"C:\Users\monis\Desktop\tcs\data"
for filename in os.listdir(data_dir):
    if filename.endswith(".json"):
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # If it's already encrypted, skip
        if not content.strip().startswith('[') and not content.strip().startswith('{'):
            continue
            
        # Encode UTF-8 -> Base64
        encoded_bytes = base64.b64encode(content.encode('utf-8'))
        encoded_str = encoded_bytes.decode('utf-8')
        
        # Reverse string to obscure it slightly more than plain Base64
        obscured = "".join(reversed(encoded_str))
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(obscured)

print("Data files encrypted successfully.")
