window.onload = () => {
    chrome.storage.local.get('uid', (data) => {
        let uid;
        if (data.uid) 
            uid = data.uid;
        else
            uid = Math.random().toString(36).substring(7);
        chrome.storage.local.set({uid: uid});

        let productId = window.location.href.split("/")[5].split("?")[0];
        let bodyData = {
            uid, productId
        }
        console.log(bodyData)
        
        fetch('http://localhost:3408/api/status', {
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

                addToCartDiv.innerHTML += `
                <h3>Why are you buying this?</h3>
                <p>Explain to 3 friends why you want to buy this product before adding to cart.</p>
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
                `;
            }
        }).catch(err => {
            console.log(err);
        });
    });
}