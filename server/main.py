from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from pymongo import MongoClient
client = MongoClient(os.environ.get('MONGO_URI', "mongodb://localhost:27017/amzn-adult-mode"))
db = client['amzn-adult-mode']

app = Flask(__name__)
CORS(app)

@app.route('/api/status', methods=['POST'])
def getStatus():
    data = request.get_json()
    print(data)
    col = db[data['uid']]

    res = col.find_one({'_id': data['productId']})
    if res:
        return jsonify(res)
    else:
        res = {"_id": data['productId'], "contactPts": [], "canBuy": False, "approvals": [], "productName": data['productName'], "uname": data['uname']}
        col.insert_one(res) 
        return jsonify(res)
    

@app.route('/api/share', methods=['POST'])
def share():
    data = request.get_json()
    print(data)
    col = db[data['uid']]

    col.update_one({'_id': data['productId']}, {"$set": {
        "contactPts": data['emails']
    }})

    res = col.find_one({'_id': data['productId']})

    emailKeys = db['emailKeys']

    sender_email = os.environ.get('SENDER_EMAIL')
    sender_password = os.environ.get('SENDER_PASSWORD')
    subject = "Your Friend is Requesting a Purchase Approval"

    for email in data['emails']:
        emailKey = os.urandom(16).hex()
        emailKeys.insert_one({"email": email, "_id": emailKey, "uid": data['uid'], "productId": data['productId']})
        body = f"Hello,\n\n{res['uname']} needs your approval to add {res['productName']} to their cart on Amazon.\n\nPlease click on the following link to approve the purchase: http://localhost:3408/approve/{emailKey}!"
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        try:
            with smtplib.SMTP(os.environ.get("SMTP_HOST"), int(os.environ.get("SMTP_PORT"))) as server:
                server.starttls()
                server.login(os.environ.get("SMTP_USERNAME"), sender_password)
                server.sendmail(sender_email, email, msg.as_string())
                print(f"Email sent to {email}")
        except Exception as e:
            print(f"Failed to send email to {email}: {e}")

    return jsonify(res)


app.run(host='0.0.0.0', port=3408, debug=True)