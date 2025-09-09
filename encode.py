# encode_credentials.py
import urllib.parse

username = "sushanthbende_db_user"
password = "Bingo@123"

encoded_username = urllib.parse.quote_plus(username)
encoded_password = urllib.parse.quote_plus(password)

print(f"Encoded username: {encoded_username}")
print(f"Encoded password: {encoded_password}")
