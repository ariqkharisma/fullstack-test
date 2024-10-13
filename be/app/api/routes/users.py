from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import User
from app.database import engine
import re
import datetime

router = APIRouter()


class UserRequest(BaseModel):
    name: str
    identity_number: str
    email: str
    date_of_birth: str

    @field_validator('name')
    def validate_name(cls, value):
        if not value or value == "":
            raise ValueError("Name is required")
        return value
    
    @field_validator('identity_number')
    def validate_identity_number(cls, value):
        if not value or value == "":
            raise ValueError("Identity number is required")
        if not value.isdigit():
            raise ValueError("Value must contain only digits")
        with Session(engine) as session:
            existing_user = session.query(User).filter(User.identity_number == value).first()
            if existing_user:
                raise ValueError("User with this identity number already exists")
        return value

    @field_validator('email')
    def validate_email(cls, value):
        regex = r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$"
        if not value or value == "":
            raise ValueError("Email is required")
        if not re.match(regex, value):
            raise ValueError("Invalid email address")
        return value

    @field_validator('date_of_birth')
    def validate_date_of_birth(cls, value):
        if not value or value == "":
            raise ValueError("Date of birth is required")
        if not datetime.datetime.strptime(value, "%Y-%m-%d"):
            raise ValueError("Date of birth must be in YYYY-MM-DD format")
        return value


@router.post("/", summary="Submit User Data")
async def submit_user_data(user: UserRequest):
    try:
        with engine.begin() as conn:
            result = conn.execute(
                text(f'''
                    INSERT INTO users (name, identity_number, email, date_of_birth) 
                    VALUES ('{user.name}', '{user.identity_number}', '{user.email}', '{user.date_of_birth}')
                    RETURNING *
                ''')
            )

        return {"detail": "User data submitted successfully"}

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error: " + str(e))


@router.get("/", summary="Get User Data", response_model=None)
async def get_user_data():
    try:
        with Session(engine) as session:
            result = session.query(User).all()

        return {"detail": "Successfully retrieved user data", "data": result}

    except ValueError as e:
        raise HTTPException(status_code=400, detail="Error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error: " + str(e))
