FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make scripts executable
RUN chmod +x /app/main.py /app/bot.py

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV API_RELOAD=false
ENV DEBUG=false

# Expose API port
EXPOSE 6007

# Run the application
CMD ["python", "main.py"]