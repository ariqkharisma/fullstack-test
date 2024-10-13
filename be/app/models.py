from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from app.database import engine

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    identity_number = Column(String, unique=True)
    email = Column(String)
    date_of_birth = Column(Date)

Base.metadata.create_all(engine)

