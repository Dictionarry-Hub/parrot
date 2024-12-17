## Parrot

Dictionarry community's messenger, keeping everyone updated on changes across our repositories 🦜

---

### **Features**

- Listens for webhook notifications (e.g., GitHub push events).
- Parses commit data (message, author, URL) and sends an embedded report to a Discord channel.

---

### **Installation & Setup**

1. **Clone the Repository**

   ```bash
   git clone <repo-url>
   cd parrot
   ```

2. **Set Up the Virtual Environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Create the `.env` File**

   ```bash
   echo "DISCORD_CHANNEL_ID=YOUR_CHANNEL_ID" > .env
   echo "BOT_TOKEN=YOUR_BOT_TOKEN" >> .env
   ```

   Replace `YOUR_CHANNEL_ID` and `YOUR_BOT_TOKEN` with the appropriate values.

5. **Run the Bot**

   ```bash
   python3 bot.py
   ```

6. **Set Up a Webhook**
   - Point your webhook (e.g., GitHub webhook) to:
     ```
     http://<your-server-ip>:9229/parrot/notify
     ```

---

### **Upcoming Features**

- **Request a Release Group**:  
   Request information about media release groups directly from the bot.

- **Bug Reports**:  
   Submit bug reports and track issues.

- **Wiki Info**:  
   Integrate quick lookups for media-related wiki data.
