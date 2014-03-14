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
def generate_payload(info):
    payload = {
        iss: 'auth.example.com',
        sub: info['customer_id'],
        dn: info['username'],
        email: info['email'],
        pw: info['password'],
        g: {
            id: 'customers',
            dn: 'Customers Group'
        }
    }

    decoded_secret = base64.decodestring(app.config['SECRET_KEY'])
    return jwt.encode(payload, decoded_secret)

"""
Routes
"""
@app.route('/login')
def login():
    """
    Atributes for the payload:
    {
        iss: 'auth.example.com'
        sub: customer_id_from stripe (number)
        dn: 'User Name'
        g: [
            id: 1,
            dn: 'customers'
        ]
    }
    """
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
    customer = stripe.Customer.create(
        email=request.json['email'],
        card=request.json['stripeToken']
    )
    print customer.id

    subscription = customer.subscriptions.create(
        plan=request.json['plan'],
    )

    return 'True'

# TODO: Create/Retrieve Customer

# TODO: Retrieve Payments

if __name__ == '__main__':
    app.run(debug=True)