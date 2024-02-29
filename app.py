import os
from flask import (
    Flask, flash, render_template, redirect,
     request, session, url_for)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
if os.path.exists("env.py"):
    import env


app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")

mongo = PyMongo(app)


numbers_entered = []


@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")


@app.route("/games")
def games():
    return render_template("games.html")


numbers_entered = []

@app.route('/match')
def match():
    concatenated_numbers = ''.join(str(num) for num in numbers_entered)
    return render_template('match.html', concatenated_numbers=concatenated_numbers)

@app.route('/update_number/<int:number>')
def update_number(number):
    numbers_entered.append(number)
    return redirect('/match')

@app.route('/delete_last_number')
def delete_last_number():
    if numbers_entered:
        numbers_entered.pop()
    return redirect('/match')
    

@app.route("/calculator")
def checkouts():
    checkouts = mongo.db.checkout.find()
    return render_template("match.html", checkouts=checkouts)


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")),
            debug=True)
