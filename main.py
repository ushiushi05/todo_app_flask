from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3, os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "default_secret_key")

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "todo.db")


class User(UserMixin):
    def __init__(self, id, username, password_hash):
        self.id = id
        self.username = username
        self.password_hash = password_hash

@login_manager.user_loader
def load_user(user_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username, password_hash FROM users WHERE id=?", (user_id,))
    row = c.fetchone()
    if row:
        return User(*row)
    return None

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
              CREATE TABLE IF NOT EXISTS users(
                  id INTEGER PRIMARY KEY,
                  username TEXT UNIQUE,
                  password_hash TEXT
              )
            """)
    c.execute("""
              CREATE TABLE IF NOT EXISTS tasks(
                  id INTEGER PRIMARY KEY, 
                  user_id INTEGER,
                  task TEXT,
                  is_done INTEGER DEFAULT 0,
                  category TEXT DEFAULT "未分類",
                  priority TEXT DEFAULT "中",
                  FOREIGN KEY(user_id) REFERENCES users(id)
                )
            """)
    conn.commit()
    conn.close()
    
@app.route("/")
@login_required
def index():
    category_filter = request.args.get("category")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    if category_filter:
        c.execute("""
                  SELECT id, task, is_done, category, priority 
                  FROM tasks 
                  WHERE user_id=? AND category=?
                  ORDER BY 
                    CASE priority
                        WHEN "高" THEN 1
                        WHEN "中" THEN 2
                        WHEN "低" THEN 3
                    END
        """, (current_user.id, category_filter))
    else:
        c.execute("""
            SELECT id, task, is_done, category, priority 
            FROM tasks 
            WHERE user_id=? 
            ORDER BY 
            CASE priority
                WHEN "高" THEN 1
                WHEN "中" THEN 2
                WHEN "低" THEN 3
            END
        """, (current_user.id,))
    print("カテゴリー：" + str(category_filter))
    active_tasks = c.fetchall()
    
    
    if category_filter:
        c.execute("""
                  SELECT id, task, is_done, category, priority
                  FROM tasks
                  WHERE user_id=? AND category=? AND is_done=1
                  ORDER BY 
                CASE priority
                    WHEN "高" THEN 1
                    WHEN "中" THEN 2
                    WHEN "低" THEN 3
                END
        """, (current_user.id, category_filter))
    else:
        c.execute("""
            SELECT id, task, is_done, category, priority 
            FROM tasks 
            WHERE user_id=? AND is_done=1 
            ORDER BY 
            CASE priority
                WHEN "高" THEN 1
                WHEN "中" THEN 2
                WHEN "低" THEN 3
            END
        """, (current_user.id,))
    completed_tasks = c.fetchall()  
    conn.close()
    
    return render_template("index.html", active_tasks=active_tasks, completed_tasks=completed_tasks, username=current_user.username)

@app.route("/add", methods=["POST"])
@login_required
def add():
    task = request.form["task"]
    category = request.form["category"]
    priority = request.form["priority"]
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO tasks(user_id, task, is_done, category, priority) VALUES(?, ?, 0, ?, ?)
    """, (current_user.id, task, category, priority))
    conn.commit()
    conn.close()
    return redirect("/")

@app.route("/toggle/<int:id>")
@login_required
def toggle(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT is_done FROM tasks WHERE id=? AND user_id=?", (id, current_user.id))
    task = c.fetchone()
    if task:
        new_status = 0 if task[0] == 1 else 1
        c.execute("UPDATE tasks SET is_done=? WHERE id=? AND user_id=?", (new_status, id, current_user.id))
        conn.commit()
    conn.close()
    return redirect("/")

@app.route("/delete/<int:id>")
@login_required
def delete(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM tasks WHERE id=? AND user_id=?", (id, current_user.id))
    conn.commit()
    conn.close()
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = generate_password_hash(request.form["password"])
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("INSERT INTO users(username, password_hash) VALUES(?,?)", (username, password))
            conn.commit()
            conn.close()
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            return "ユーザー名がすでに存在します"
    return render_template("register.html")
            
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, username, password_hash FROM users WHERE username=?", (username,))
        row = c.fetchone()
        conn.close()
        if row and check_password_hash(row[2], password):
            user = User(*row)
            login_user(user)
            return redirect(url_for("index"))
        else:
            return "ユーザー名またはパスワードが間違っています"
    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
