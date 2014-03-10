import os
from flask import Flask, render_template, request
import stripe

stripe_keys = {
    'secret_key': os.environ['SECRET_KEY'],
    'publishable_key': os.environ['PUBLISHABLE_KEY']
}

stripe.api_key = stripe_keys['secret_key']

ROOT = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__, template_folder=ROOT+'/templates')
app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('index.html', key=stripe_keys['publishable_key'])

@app.route('/history')
def history():
    return render_template('history.html', key=stripe_keys['publishable_key'])

@app.route('/charge', methods=['POST'])
def charge():
    # Amount in cents
    amount = 500

    customer = stripe.Customer.create(
        email='customer@example.com',
        card=request.json['stripeToken']
    )

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=amount,
        currency='usd',
        description='Flask Charge'
    )

    return render_template('charge.html', amount=amount)

# TODO: Create/Retrieve Customer

# TODO: Retrieve Payments

if __name__ == '__main__':
    app.run(debug=True)