from flask import Flask, render_templete, request, redirect
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("todo.db")
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, task TEXT)")
    conn.commit()
    conn.close()
    
@app.route("/")
def index():
    conn = sqlite3.connect("todo.db")
    c = conn.cursor()
    c.execute("SELECT * FROM tasks")
    tasks = c.fetchall()
    conn.close()
    return render_templete("index.html", tasks=tasks)
