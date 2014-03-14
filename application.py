# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template, request
import stripe
import json
import jwt
import base64

"""
configuration
"""
stripe_keys = {
    'secret_key': os.environ['STRIPE_SECRET_KEY'],
    'publishable_key': os.environ['PUBLISHABLE_KEY']
}
stripe.api_key = stripe_keys['secret_key']

ROOT = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__, template_folder=ROOT+'/templates')
app.config['DEBUG'] = True

app.config['SECRET_KEY'] = os.environ['SECRET_KEY']


"""
Utils
"""
def create_customer(email, card=None):
    return stripe.Customer.create(
        email=email,
        card=card
    )


"""
Routes
"""
@app.route('/auth', methods=['POST'])
def auth():
    payload = {
        'iss': 'hidden-plains-5795.herokuapp.com',
        'sub': request.json['customer_id'],
        'dn': request.json['username'],
        'email': request.json['email'],
        'pw': request.json['password'],
        'g': {
            'id': 'customers',
            'dn': 'Customers Group'
        }
    }

    decoded_secret = base64.decodestring(app.config['SECRET_KEY'])
    return jwt.encode(payload, decoded_secret)


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/')
def index():
    return render_template('index.html', key=stripe_keys['publishable_key'])

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/get_history', methods=['POST'])
def get_history():
    customer = stripe.Customer.retrieve(request.json['customer_id'])
    if customer:
        return json.dumps(customer)
    else:
        return 'Customer not found'

@app.route('/subscribe', methods=['POST'])
def subscribe():
    # Save this object
    customer = create_customer(request.json['email'], request.json['stripeToken'])

    subscription = customer.subscriptions.create(
        plan=request.json['plan'],
    )

    return json.dumps(subscription)

# Would be better if it were an AngularJS Service
@app.route('/customer/<customer_id>')
def get_customer(customer_id):
    return json.dumps(stripe.Customer.retrieve(customer_id))

@app.route('/customer/new', methods=['POST'])
def new_customer():
    return json.dumps(create_customer(request.json['email']))

@app.route('/verify/username/<username>')
def verify_user(username):
    return json.dumps(False)

@app.route('/verify/email/<email>')
def verify_email(email):
    return json.dumps(False)

if __name__ == '__main__':
    app.run(debug=True)