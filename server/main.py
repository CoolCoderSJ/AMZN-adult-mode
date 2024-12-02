from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

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
        res = {"_id": data['productId'], "contactPts": [], "canBuy": False, "approvals": []}
        col.insert_one(res) 
        return jsonify(res)
    

app.run(host='0.0.0.0', port=3408, debug=True)