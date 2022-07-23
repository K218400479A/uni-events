"use strict"

// global variables
let hashRoute;




let currentUserID;
let currentUsername;

// dummy user info
// hashRoute = "";
// sessionStorage.loggedInUserID = 0;
// sessionStorage.loggedInUserID = "-Mk5rX3v-nvz4PIFB6Qp";

// server
function listen() {
    let current = getCurrent();
    if (currentUserID !== sessionStorage.loggedInUserID) {
        console.log("----------------------------------------------------");
        console.log(window.location.hash, "user:" + sessionStorage.loggedInUserID);
        if (!sessionStorage.loggedInUserID) {
            currentUserID = sessionStorage.loggedInUserID;
            currentUsername = null;
            route();
        }
        else if (sessionStorage.loggedInUserID) {
            // GET users
            fetch(`https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/users/${sessionStorage.loggedInUserID}.json`)
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    currentUserID = sessionStorage.loggedInUserID;
                    currentUsername = data.username;
                    route();
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
    else if (current !== hashRoute) {
        console.log("----------------------------------------------------");
        console.log(window.location.hash, "user:" + sessionStorage.loggedInUserID);
        hashRoute = current;
        route();
    }

    function route() {
        console.log(currentUsername);
        document.getElementById("navProfile").innerText = currentUsername;
        document.getElementById("errorBox").classList.remove("active");
        if (!sessionStorage.loggedInUserID) {
            console.log("logged out");
            document.getElementById("navOrganize").classList.add("invisible");
            document.getElementById("navProfile").classList.add("invisible");
            document.getElementById("navLogout").classList.add("invisible");
            document.getElementById("navLogin").classList.remove("invisible");

            if (!hashRoute
                || !hashRoute.includes("#register")
                && !hashRoute.includes("#login")) {
                guestHome();
                // window.location.hash = "#guestHome";
            }
            else if (hashRoute.includes("#register")) register();
            else if (hashRoute.includes("#login")) login();
        }
        else {
            console.log("logged in");
            document.getElementById("navOrganize").classList.remove("invisible");
            document.getElementById("navProfile").classList.remove("invisible");
            document.getElementById("navLogout").classList.remove("invisible");
            document.getElementById("navLogin").classList.add("invisible");

            if (!hashRoute
                || hashRoute.includes("#register")
                || hashRoute.includes("#login")
                || hashRoute.includes("#guestHome")
                || hashRoute.includes("#userHome")) {
                userHome();
                // window.location.hash = "#userHome";
            }
            else if (hashRoute.includes("#organize")) organize();
            else if (hashRoute.includes("#details")) {
                let hashSplit = hashRoute.split("/");
                details(hashSplit[1]);
            }
            else if (hashRoute.includes("#edit")) {
                let hashSplit = hashRoute.split("/");
                edit(hashSplit[1]);
            }
            else if (hashRoute.includes("#close")) {
                let [hash, itemID] = hashRoute.split("/");
                console.log("itemID:", itemID);
                // DELETE the item
                notify("Loading...", "loadingBox");
                let url = `https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events/${itemID}.json`;
                let headers = {
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                    // headers: { 'Content-Type': 'application/json' }
                };
                console.log("URL:", url);
                fetch(url, headers)
                    .then(function (response) {
                        console.log(response.status);
                        if (response.status == 200) {
                            notify("Event successfully closed", "successBox");
                            window.location.hash = "#userHome";
                        }
                    })
                    .catch(err => console.error(err));
            }
            else if (hashRoute.includes("#join")) {
                let [hash, itemID, interestNo] = hashRoute.split("/");
                interestNo = Number(interestNo);
                console.log("itemID:", itemID, "interested:", interestNo);

                let inputObj = {
                    interested: interestNo + 1,
                }

                notify("Loading...", "loadingBox");
                // PATCH the username into the people interested
                let url = `https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events/${itemID}/.json`;
                let headers = {
                    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputObj) // body data type must match "Content-Type" header
                };
                fetch(url, headers)
                    .then(function (response) {
                        console.log(response.status);
                        if (response.status == 200) {
                            notify("Event successfully joined", "successBox");
                            window.location.hash = "#userHome";
                        }
                    })
                    .catch(err => console.error(err));

            }
            else if (hashRoute.includes("#profile")) profile();
            else if (hashRoute.includes("#logout")) {
                sessionStorage.clear();
                notify("Logout Successful", "successBox");
            }
        }
    }
    setTimeout(listen, 300);
};
listen();

function getCurrent() {
    return window.location.hash;
};