from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'securekey'  # Change this for security


def init_db():
    with sqlite3.connect('bank.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY,
                            username TEXT UNIQUE,
                            password TEXT,
                            balance REAL DEFAULT 0.0)''')
        conn.commit()


def get_user(username):
    with sqlite3.connect('bank.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        return cursor.fetchone()


def update_balance(username, amount):
    with sqlite3.connect('bank.db') as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE users SET balance = balance + ? WHERE username = ?", (amount, username))
        conn.commit()


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = get_user(username)
        if user and user[2] == password:  # Simple authentication
            session['user'] = username
            return redirect(url_for('dashboard'))
    return render_template('login.html')


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    user = get_user(session['user'])
    balance = user[3] if user else 0.0
    if request.method == 'POST':
        action = request.form['action']
        amount = float(request.form['amount'])
        if action == 'deposit':
            update_balance(session['user'], amount)
        elif action == 'withdraw' and amount <= balance:
            update_balance(session['user'], -amount)
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html', balance=balance)


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    init_db()
    app.run(debug=True)

# Minimal HTML Templates:

# login.html
login_html = '''
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        form { display: inline-block; padding: 20px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h2>Login</h2>
    <form method="post">
        <input type="text" name="username" placeholder="Username" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
'''

# dashboard.html
dashboard_html = '''
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        form { display: inline-block; margin: 10px; }
    </style>
</head>
<body>
    <h2>Welcome, {{ session['user'] }}</h2>
    <p>Balance: ${{ balance }}</p>
    <form method="post">
        <input type="number" name="amount" placeholder="Amount" required>
        <button type="submit" name="action" value="deposit">Deposit</button>
        <button type="submit" name="action" value="withdraw">Withdraw</button>
    </form>
    <br><br>
    <a href="{{ url_for('logout') }}">Logout</a>
</body>
</html>
'''
