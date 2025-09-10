# authapp/mongodb_client.py
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from decouple import config
import logging

logger = logging.getLogger(__name__)

class MongoDBClient:
    _instance = None
    _client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def get_client(self):
        if self._client is None:
            try:
                self._client = MongoClient(
                    config('MONGODB_URI'),
                    serverSelectionTimeoutMS=5000,  # 5 second timeout
                    connectTimeoutMS=5000,
                    socketTimeoutMS=5000,
                    maxPoolSize=10,
                    retryWrites=True
                )
                # Test the connection
                self._client.admin.command('ping')
            except Exception as e:
                logger.error(f"MongoDB connection failed: {e}")
                raise
        return self._client
    
    def get_database(self):
        return self.get_client().get_database()
    
    def get_users_collection(self):
        return self.get_database().users

# Global instance
client_instance = MongoDBClient()
client = client_instance.get_client()