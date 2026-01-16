import sqlite3
conn = sqlite3.connect('katha.db')
cursor = conn.cursor()
# Clear broken ai_image_url and ai_audio_url to force regeneration
cursor.execute("UPDATE scene SET ai_image_url = NULL, ai_audio_url = NULL, ai_caption = NULL")
conn.commit()
print("Cleared scene AI metadata to force regeneration")
conn.close()
