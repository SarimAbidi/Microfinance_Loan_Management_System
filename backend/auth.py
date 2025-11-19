from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
import hashlib

SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_THIS"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

FAKE_USER_DB = {
    "admin": {
        "username": "admin",
        "hashed_password": hash_password("admin123")
    }
}


def authenticate_user(username: str, password: str):
    if username not in FAKE_USER_DB:
        return False
    user = FAKE_USER_DB[username]
    if hash_password(password) != user["hashed_password"]:
        return False
    return user


def create_token(username: str):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return data["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
