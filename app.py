# ... other imports ...
from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import bcrypt

app = Flask(__name__, static_folder='access')

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ijse@2001'
app.config['MYSQL_DB'] = 'userdatabase'

mysql = MySQL(app)
app.secret_key = 'your_secret_key'

# Sign Up Route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert user into the database
        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
                       (username, email, hashed_password))
        mysql.connection.commit()
        cursor.close()
        return redirect(url_for('login'))

    return render_template('signup.html')

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password'].encode('utf-8')

        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password, user[3].encode('utf-8')):
            session['email'] = user[2]  # Store the user's email in the session
            return render_template('index.html', email=session['email'])
        else:
            return 'Invalid login credentials!'

    return render_template('signin.html')

# Dashboard Route
@app.route('/dashboard')
def dashboard():
    if 'email' in session:
        return render_template('index.html', email=session['email'])
    else:
        return redirect(url_for('login'))

# Logout Route
@app.route('/logout')
def logout():
    session.pop('email', None)  # Remove email from session
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
