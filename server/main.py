import os
import json
import uuid
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi.responses import Response
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
RECIPES_FILE = os.path.join(DATA_DIR, "recipes.json")
INGREDIENTS_FILE = os.path.join(DATA_DIR, "ingredients.json")
AVATAR_DIR = os.path.join(BASE_DIR, "avatars")
API_BASE = "/api"

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(AVATAR_DIR, exist_ok=True)
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump({"users": []}, f, ensure_ascii=False, indent=2)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
sessions: Dict[str, str] = {}  # token -> username

app = FastAPI(title="Stitch Kitchen API")

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set in .env file")
    # Force unset proxy env vars if they cause issues with httpx
    # os.environ.pop("HTTP_PROXY", None)
    # os.environ.pop("HTTPS_PROXY", None)
    # os.environ.pop("ALL_PROXY", None)
    return OpenAI(api_key=api_key)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static avatars
app.mount("/avatars", StaticFiles(directory=AVATAR_DIR), name="avatars")


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


# Helpers

def read_users() -> Dict[str, Any]:
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_users(data: Dict[str, Any]):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_user(username: str) -> Optional[Dict[str, Any]]:
    data = read_users()
    for u in data.get("users", []):
        if u.get("username") == username:
            return u
    return None


def save_user(user: Dict[str, Any]):
    data = read_users()
    users = data.get("users", [])
    for i, u in enumerate(users):
        if u.get("username") == user.get("username"):
            users[i] = user
            write_users({"users": users})
            return
    users.append(user)
    write_users({"users": users})


def require_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1].strip()
    username = sessions.get(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return username


@app.post(f"{API_BASE}/auth/register")
def register(req: RegisterRequest):
    if get_user(req.username):
        raise HTTPException(status_code=409, detail="Username already exists")
    password_hash = pwd_context.hash(req.password)
    user = {"username": req.username, "password_hash": password_hash, "avatar_filename": None}
    save_user(user)
    return {"message": "Registered successfully"}


@app.post(f"{API_BASE}/auth/login")
def login(req: LoginRequest):
    user = get_user(req.username)
    if not user or not pwd_context.verify(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = str(uuid.uuid4())
    sessions[token] = req.username
    avatar_url = None
    if user.get("avatar_filename"):
        avatar_url = f"/avatars/{user['avatar_filename']}"
    return {"token": token, "user": {"username": req.username, "avatar_url": avatar_url}}


@app.get(f"{API_BASE}/users/me")
def me(authorization: Optional[str] = Header(None)):
    username = require_token(authorization)
    user = get_user(username)
    avatar_url = None
    if user and user.get("avatar_filename"):
        avatar_url = f"/avatars/{user['avatar_filename']}"
    return {"username": username, "avatar_url": avatar_url}


@app.post(f"{API_BASE}/users/avatar")
def upload_avatar(authorization: Optional[str] = Header(None), avatar: UploadFile = File(...)):
    username = require_token(authorization)
    # save file
    ext = os.path.splitext(avatar.filename)[1].lower() or ".png"
    safe_ext = ".png" if ext not in [".png", ".jpg", ".jpeg", ".webp"] else ext
    filename = f"{username}{safe_ext}"
    filepath = os.path.join(AVATAR_DIR, filename)
    with open(filepath, "wb") as out:
        out.write(avatar.file.read())
    # update user record
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["avatar_filename"] = filename
    save_user(user)
    return {"avatar_url": f"/avatars/{filename}"}


@app.post(f"{API_BASE}/users/password")
def change_password(req: ChangePasswordRequest, authorization: Optional[str] = Header(None)):
    username = require_token(authorization)
    user = get_user(username)
    if not user or not pwd_context.verify(req.old_password, user.get("password_hash", "")):
        raise HTTPException(status_code=403, detail="Old password incorrect")
    user["password_hash"] = pwd_context.hash(req.new_password)
    save_user(user)
    return {"message": "Password updated"}


@app.get("/")
def root():
    return {"status": "ok"}

# ---- Fix for stray Vite client requests hitting backend ----
@app.get("/@vite/client")
def vite_client_stub():
    return Response(content="// Vite client stub: no-op in static env", media_type="application/javascript")

@app.get("/%40vite/client")
def vite_client_stub_encoded():
    # Some environments may send the URL-encoded path. Provide the same stub.
    return Response(content="// Vite client stub: no-op in static env (encoded)", media_type="application/javascript")

@app.get("/__vite_ping")
def vite_ping_stub():
    return {"status": "ok"}


@app.post(f"{API_BASE}/recipes/generate")
def generate_recipe(authorization: Optional[str] = Header(None)):
    username = require_token(authorization)
    
    if not os.path.exists(INGREDIENTS_FILE):
        raise HTTPException(status_code=404, detail="Ingredients file not found")
        
    with open(INGREDIENTS_FILE, "r", encoding="utf-8") as f:
        ingredients_data = json.load(f)
    
    # Format ingredients for the prompt
    ingredients_list = [f"{item['name']}: {item['amount']}g" for item in ingredients_data]
    ingredients_str = ", ".join(ingredients_list)
    
    prompt = f"""
    你是一个专业的厨师。请根据以下现有的食材清单，为用户推荐一道美味的菜谱。
    食材清单: {ingredients_str}
    
    输出必须是严格的 JSON 格式，包含以下字段：
    - name: 菜名
    - description: 简单介绍
    - type: 餐次（早饭/中饭/晚饭）
    - time: 一个对象，包含 prep (准备时间，分钟) 和 cook (烹饪时间，分钟)
    - ingredients: 一个数组，每个对象包含 name (食材名), amount (建议使用的重量，数字，单位g), isEnough (布尔值，根据现有食材判断是否足够，通常设为 true)
    - steps: 详细步骤数组
    
    请只返回 JSON 对象，不要有任何其他文字。
    """
    
    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # 或者使用 "gpt-4"
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        
        recipe_content = json.loads(response.choices[0].message.content)
        
        # Save to recipes.json
        recipes = []
        if os.path.exists(RECIPES_FILE):
            with open(RECIPES_FILE, "r", encoding="utf-8") as f:
                recipes = json.load(f)
        
        recipes.append(recipe_content)
        
        with open(RECIPES_FILE, "w", encoding="utf-8") as f:
            json.dump(recipes, f, ensure_ascii=False, indent=2)
            
        return recipe_content
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))