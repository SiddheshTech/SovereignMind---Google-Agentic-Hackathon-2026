from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignUpRequest(BaseModel):
    call_sign: str
    email: EmailStr
    password: str

class UserSignInRequest(BaseModel):
    email: EmailStr
    password: str
    badge_key: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    call_sign: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True
