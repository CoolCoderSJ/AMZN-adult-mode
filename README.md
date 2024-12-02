# AMZN Adult Mode

AMZN Adult Mode is the live recreation for this Soren Iverson design: https://www.instagram.com/p/DC99cV9TTyv/

It requires a user to get their purchase approved by at least 2/3 people before they can add it to their amazon cart.

## Features

- Browser extension to intercept Amazon product pages.
- Server application to handle approval requests and email notifications.
- MongoDB database to store user data and approval statuses.

## Setup

### Prerequisites

- Python 3.x
- Node.js
- MongoDB
- Flask
- Chrome browser

### Server Setup

1. Clone the repository:
    
    ```bash
    git clone https://github.com/CoolCoderSJ/AMZN-adult-mode.git
    cd AMZN-adult-mode
    ```
2. Install the required Python packages:
    
    ```bash
    pip install -r requirements.txt
    ```
3. Copy .env.example to .env and fill it out
4. Set up the MongoDB server:
    
    ```bash
    mongod
    ```
5. Start the server:
    
    ```bash
    python main.py
    ```
6. The server should now be running on `http://localhost:3408`.