import sqlite3

conn = sqlite3.connect('bank.db')
cursor = conn.cursor()

# Insert a user (change username and password as needed)
cursor.execute("INSERT INTO users (username, password, balance) VALUES (?, ?, ?)",
               ("testuser", "password123", 100.0))

conn.commit()
conn.close()

print("User added successfully!")
