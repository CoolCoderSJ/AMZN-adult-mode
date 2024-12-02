window.onload = () => {
    chrome.storage.local.get('uid', (data) => {
        chrome.storage.local.get("uname", (d) => {
            let uid;
            if (data.uid) 
                uid = data.uid;
            else
                uid = Math.random().toString(36).substring(7);
            chrome.storage.local.set({uid: uid});

            let uname;
            if (d.uname) 
                uname = d.uname;
            else
                uname = "Anonymous";
            chrome.storage.local.set({uname: uname});

            let productId = window.location.href.split("/")[5].split("?")[0];
            let productName = document.querySelector('#productTitle').innerText.trim();
            let bodyData = {
                uid, productId, productName, uname
            }
            console.log(bodyData)
            
            fetch('https://amzn-adult.shuchir.dev/api/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.canBuy == false) {
                    let addToCartDiv = document.querySelector('#addToCart_feature_div');
                    let atcBtn = addToCartDiv.querySelector('.a-button-stack');
                    atcBtn.style.display = 'none';

                    let buyNowDiv = document.querySelector('#buyNow_feature_div');
                    buyNowDiv.style.display = 'none';

                    let innerText;
                    if (data.contactPts.length == 0) 
                        innerText = "Explain to 3 friends why you want to buy this product before adding to cart.";
                    else if (data.contactPts.length - data.approvals.length > 0)
                        innerText = "Waiting for " + (data.contactPts.length - data.approvals.length) + " response(s) before you can add to cart.";
                    else
                        innerText = "Your friends have rejected your purchase. Perhaps it's time for better friends?";

                    addToCartDiv.innerHTML += `
                    <h3>Why are you buying this?</h3>
                    <p>${innerText}</p>
                    ${data.contactPts.length == 0 ? `
                    <div style="display: flex;gap: 8px;margin-bottom: 20px;">
                        <div class="a-button-stack" style="width: 100%;">
                            <span class="a-declarative" id="nobtn">
                                <span class="a-button a-spacing-small a-button-primary a-button-icon natc-enabled">
                                    <span class="a-button-inner" style="cursor: not-allowed;pointer-events: none;background: white;">
                                        <i class="a-icon a-icon-cart"></i><input title="No" class="a-button-input" type="button">
                                        <span class="a-button-text">No</span>
                                    </span>
                                </span>
                            </span>
                        </div>
                            
                        <div class="a-button-stack" style="width: 100%;">
                            <span class="a-declarative" id="share">
                                <span class="a-button a-spacing-small a-button-primary a-button-icon natc-enabled">
                                    <span class="a-button-inner" style="background: lightgreen;">
                                        <i class="a-icon a-icon-cart"></i><input class="a-button-input" type="button">
                                        <span class="a-button-text">Share &amp; Explain</span>
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                    ` : ''}
                    `;

                    addToCartDiv.innerHTML += `<div id="shareModal" style="position: fixed;z-index: 9999;top: 0;background: rgba(0,0,0,0.6);left: 0;right: 0;bottom: 0;display: none;justify-content: center;">
        <div style="border-radius: 6px;padding: 20px;background: white;width: 50%;height: fit-content;margin-top: 5%;">
            <h2>Enter 3 emails to ask for approval</h2>
            <br>
            <input type="email" id="email1" name="email1" class="a-input-text a-span12" required="" style="margin-left: 0px; margin-bottom: 7px;" placeholder="Email 1">
            <input type="email" id="email2" name="email2" class="a-input-text a-span12" required="" style="margin-left: 0px; margin-bottom: 7px;" placeholder="Email 2">
            <input type="email" id="email3" name="email3" class="a-input-text a-span12" required="" style="margin-left: 0px; margin-bottom: 7px;" placeholder="Email 3">

            <div style="display: flex;gap: 8px;margin-bottom: 20px;">
                <div class="a-button-stack" style="width: 100%;">
                    <span class="a-declarative" id="cancelModal">
                    <span class="a-button a-spacing-small a-button-primary a-button-icon natc-enabled">
                        <span class="a-button-inner" style="cursor: not-allowed;pointer-events: none;background: white;">
                            <span class="a-button-text">Cancel</span>
                        </span>
                    </span>
                    </span>
                </div>
                        
                <div class="a-button-stack" style="width: 100%;">
                    <span class="a-declarative" id="shareModalBtn">
                    <span class="a-button a-spacing-small a-button-primary a-button-icon natc-enabled">
                        <span class="a-button-inner" style="background: lightgreen;">
                            <span class="a-button-text">Send</span>
                        </span>
                    </span>
                    </span>
                </div>
            </div>
        </div>
    </div>`;
                    
                    addToCartDiv.querySelector('#share').addEventListener('click', () => {
                        document.querySelector('#shareModal').style.display = 'flex';
                    });

                    document.querySelector('#cancelModal').addEventListener('click', () => {
                        document.querySelector('#shareModal').style.display = 'none';
                    });

                    document.querySelector('#shareModalBtn').addEventListener('click', () => {
                        let email1 = document.querySelector('#email1').value;
                        let email2 = document.querySelector('#email2').value;
                        let email3 = document.querySelector('#email3').value;
                        let emails = [email1, email2, email3];
                        fetch('https://amzn-adult.shuchir.dev/api/share', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({uid, emails, productId})
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            window.location.reload();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    })
                }
            }).catch(err => {
                console.log(err);
            });
        })
    });
}