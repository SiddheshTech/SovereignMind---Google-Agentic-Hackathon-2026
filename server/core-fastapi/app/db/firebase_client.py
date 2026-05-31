import firebase_admin
from firebase_admin import credentials, db, firestore
import os
from app.core.config import settings

class MockFirestore:
  """Local Firestore Mock for off-grid operations."""
  def __init__(self):
    self.db = {}

  def collection(self, name):
    class Collection:
      def __init__(self, col_name, parent_db):
        self.col_name = col_name
        self.parent_db = parent_db

      def document(self, doc_id):
        class Document:
          def __init__(self, d_id, c_name, p_db):
            self.d_id = d_id
            self.c_name = c_name
            self.p_db = p_db

          def set(self, data):
            if self.c_name not in self.p_db.db:
              self.p_db.db[self.c_name] = {}
            self.p_db.db[self.c_name][self.d_id] = data
            print(f"[Mock Firebase Document Set] {self.c_name}/{self.d_id}: {data}")

          def get(self):
            class Snapshot:
              def __init__(self, val):
                self._val = val
                self.exists = val is not None

              def to_dict(self):
                return self._val

            val = self.p_db.db.get(self.c_name, {}).get(self.d_id)
            return Snapshot(val)

        return Document(doc_id, self.col_name, self.parent_db)

    return Collection(name, self)

# Initialize Firebase Admin SDK if credentials exist
firebase_app = None
firestore_client = None

if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
  try:
    print(f"🔌 Initializing Firebase with: {settings.FIREBASE_CREDENTIALS_PATH}")
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    firebase_app = firebase_admin.initialize_app(cred)
    firestore_client = firestore.client()
    print("✅ Firebase Admin SDK Initialized")
  except Exception as e:
    print(f"⚠️ Firebase initialization failed ({e}). Falling back to local Mock.")
    firestore_client = MockFirestore()
else:
  print("⚠️ Firebase Credentials Path not provided. Falling back to local Mock.")
  firestore_client = MockFirestore()
