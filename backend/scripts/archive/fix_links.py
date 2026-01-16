import sqlite3
conn = sqlite3.connect('katha.db')
cursor = conn.cursor()
cursor.execute("UPDATE story SET cover_image_url = 'https://images.unsplash.com/photo-1582213713303-99800662d50f?q=80&w=800&auto=format&fit=crop' WHERE id = 1")
conn.commit()
print("Updated story 1 cover image")
conn.close()
