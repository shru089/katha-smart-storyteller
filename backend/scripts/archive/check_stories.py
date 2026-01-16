import sqlite3
conn = sqlite3.connect('katha.db')
cursor = conn.cursor()
cursor.execute("SELECT id, title, cover_image_url FROM story")
stories = cursor.fetchall()
print("Stories:", stories)
conn.close()
