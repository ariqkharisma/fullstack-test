from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

# Create Engine
engine = create_engine(
  'postgresql://{username}:{password}@{host}:{port}/{database}'.format(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME")
  )
)