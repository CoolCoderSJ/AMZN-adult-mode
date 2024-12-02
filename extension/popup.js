window.onload = () => {
    chrome.storage.local.get('uid', (data) => {
        let uid;
        if (data.uid) 
            uid = data.uid;
        else
            uid = Math.random().toString(36).substring(7);
        chrome.storage.local.set({uid: uid});
    });

    chrome.storage.local.get("uname", (data) => {
        if (data.uname) {
            document.querySelector("#uname").value = data.uname;
        }
    });

    document.querySelector("#uname").addEventListener("change", (e) => {
        chrome.storage.local.set({uname: e.target.value});
    });
}