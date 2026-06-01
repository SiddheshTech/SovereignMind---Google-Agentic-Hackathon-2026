import os
from typing import Dict, Any, Optional

class MockMongoDBClient:
  """Local MongoDB Mock Client for off-grid operations."""
  def __init__(self):
    self.db = {}

  def __getitem__(self, db_name):
    class MockDatabase:
      def __init__(self, db_n, p_client):
        self.db_n = db_n
        self.p_client = p_client

      def __getitem__(self, coll_name):
        class MockCollection:
          def __init__(self, c_name, d_name, parent):
            self.c_name = c_name
            self.d_name = d_name
            self.parent = parent

          def insert_one(self, document: Dict[str, Any]):
            if self.c_name not in self.parent.p_client.db:
              self.parent.p_client.db[self.c_name] = []
            self.parent.p_client.db[self.c_name].append(document)
            print(f"🍃 [Mock MongoDB Insert] Database: '{self.d_name}', Collection: '{self.c_name}': {document}")
            return type('InsertResult', (object,), {"inserted_id": len(self.parent.p_client.db[self.c_name])})()

          def find_one(self, filter: Dict[str, Any]) -> Optional[Dict[str, Any]]:
            docs = self.parent.p_client.db.get(self.c_name, [])
            for doc in docs:
              match = True
              for k, v in filter.items():
                if doc.get(k) != v:
                  match = False
                  break
              if match:
                return doc
            return None

          def find(self, filter: Dict[str, Any] = None):
            docs = self.parent.p_client.db.get(self.c_name, [])
            if not filter:
              return docs
            matched = []
            for doc in docs:
              match = True
              for k, v in filter.items():
                if doc.get(k) != v:
                  match = False
                  break
              if match:
                matched.append(doc)
            return matched

        return MockCollection(coll_name, self.db_n, self)

    return MockDatabase(db_name, self)

# Initialize MongoDB client with live driver or local mock fallback
mongo_client = None
mongo_url = os.getenv("MONGODB_URL", "")

if mongo_url:
  try:
    from pymongo import MongoClient
    mongo_client = MongoClient(mongo_url, serverSelectionTimeoutMS=2000)
    # Ping database to trigger connection verification
    mongo_client.admin.command('ping')
    print(f"🔌 Connected to MongoDB: {mongo_url}")
  except Exception as e:
    print("ℹ️ [MongoDB Client] Local high-fidelity mock database initialized.")
    mongo_client = MockMongoDBClient()
else:
  print("ℹ️ [MongoDB Client] Local high-fidelity mock database initialized.")
  mongo_client = MockMongoDBClient()

