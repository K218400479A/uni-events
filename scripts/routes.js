"use strict"

function guestHome() {
    let source = document.getElementById("guestHome-template").innerHTML;
    let template = Handlebars.compile(source);
    let context = {};
    let html = template(context);
    render(html);
}
// guestHome();

function register() {
    let source = document.getElementById("register-template").innerHTML;
    let template = Handlebars.compile(source);
    let context = {};
    let html = template(context);
    render(html);
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("errorBox").classList.remove("active");

        let username = document.getElementById("inputUsername").value;
        let password = document.getElementById("inputPassword").value;
        let rePassword = document.getElementById("inputRePassword").value;
        let regexU = /[a-zA-Z1-9]{3,}/g;
        let regexP = /.{6,}/g;
        if (!regexU.test(username)) {
            notify("Username must be at least 3 characters long, only letters and numbers", "errorBox");
            return;
        }
        if (!regexP.test(password)) {
            notify("Password must be at least 6 characters long", "errorBox");
            document.getElementById("inputPassword").value = "";
            document.getElementById("inputRePassword").value = "";
            return;
        }
        if (password != rePassword) {
            notify("Passwords must match", "errorBox");
            document.getElementById("inputRePassword").value = "";
            return;
        }

        let inputObj = {
            username,
            password
        };

        notify("Loading...", "loadingBox");
        fetch(`https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`)
            .then(response => {
                if (response.status == 200) {
                    console.log(response);
                    return response.json();
                }
                else {
                    console.log(response.status);
                }
            })
            .then(data => {
                let dupe = false;
                console.log("dupe:", dupe);
                for (let dataID in data) {
                    if (data[dataID].username == inputObj.username) {
                        dupe = true;
                        document.getElementById("inputUsername").value = "";
                        notify("Username already exists", "errorBox");
                        return;
                    }
                }
                console.log("dupe:", dupe);
                let url = "https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
                let headers = {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputObj) // body data type must match "Content-Type" header
                };
                notify("Loading...", "loadingBox");
                fetch(url, headers)
                    .then(response => {
                        if (response.status == 200) {
                            console.log(response);
                            return response.json();
                        }
                        else {
                            console.log(response.status);
                        }
                    })
                    .then(data => {
                        notify("User registration successful", "successBox");
                        sessionStorage.loggedInUserID = data.name;
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch(err => {
                console.error(err);
            });


    });
}
// register();

function login() {
    let source = document.getElementById("login-template").innerHTML;
    let template = Handlebars.compile(source);
    let context = {};
    let html = template(context);
    render(html);
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("errorBox").classList.remove("active");

        let userName = document.getElementById("inputUsername").value;
        let passWord = document.getElementById("inputPassword").value;

        // GET events
        notify("Loading...", "loadingBox");
        fetch("https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/users.json")
            .then(response => {
                if (response.status == 200) {
                    console.log(response);
                    return response.json();
                }
                else {
                    console.log(response.status);
                }
            })
            .then(data => {
                console.log(data);
                for (let id in data) {
                    if (userName == data[id].username && passWord == data[id].password) {
                        document.getElementById("inputUsername").value = "";
                        document.getElementById("inputPassword").value = "";
                        notify("Login Successful", "successBox");
                        sessionStorage.loggedInUserID = id;
                        return;
                    }
                }
                notify("username or password could not be found!", "errorBox");
                document.getElementById("inputPassword").value = "";
            })
            .catch(err => {
                console.error(err);
            });
    });




}
// logins();

function userHome() {
    // GET events
    notify("Loading...", "loadingBox");
    fetch("https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events.json")
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("data:", data);
            if (data == null) {
                oops();
                document.getElementById("loadingBox").classList.remove("active");
            }
            else {
                // convert {eventID: {}, eventID: {}...} => [ {}, {}...]
                let events = Object.entries(data);
                events = events.map(arr => {
                    let [id, eventsObj] = arr;
                    eventsObj.id = id;
                    return eventsObj;
                });
                events.sort((a, b) => {
                    return b.interested - a.interested;
                });
                console.log("events array:", events);
                let source = document.getElementById("userHome-template").innerHTML;
                let template = Handlebars.compile(source);
                let context = { events };
                let html = template(context);
                render(html);
                document.getElementById("loadingBox").classList.remove("active");
            }
        })
        .catch(err => {
            console.error(err);
        });
}
// userHome();

function organize() {
    let source = document.getElementById("organize-template").innerHTML;
    let template = Handlebars.compile(source);
    let context = {};
    let html = template(context);
    render(html);
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("errorBox").classList.remove("active");

        let name = document.getElementById("inputEventName").value;
        let dateTime = document.getElementById("inputEventDate").value;
        let description = document.getElementById("inputEventDescription").value;
        let imageURL = document.getElementById("inputEventImage").value;
        let regexN = /.{6,}/g;
        let regexDa = /^[0-3]{1}[0-9] [a-zA-Z]{3}$/g;
        let regexDi = /.{10,}/g;
        let regexI = /^http:\/\/|^https:\/\//g;
        if (!regexN.test(name)) {
            notify("Event name must be at least 6 characters long", "errorBox");
            return;
        }
        if (!regexDa.test(dateTime)) {
            notify("Date must be in the format: DD MMM", "errorBox");
            return;
        }
        if (!regexDi.test(description)) {
            notify("Description must be at least 10 characters long", "errorBox");
            return;
        }
        if (!regexI.test(imageURL)) {
            notify("Image URL must start with: http:// or https://", "errorBox");
            return;
        }

        let inputObj = {
            name,
            dateTime,
            description,
            imageURL,
            interested: 0,
            organizerUsername: currentUsername
        };
        let url = "https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events.json";
        let headers = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputObj) // body data type must match "Content-Type" header
        };
        notify("Loading...", "loadingBox");
        fetch(url, headers)
            .then(response => {
                if (response.status == 200) {
                    console.log(response);
                    document.getElementById("inputEventName").value = "";
                    document.getElementById("inputEventDate").value = "";
                    document.getElementById("inputEventDescription").value = "";
                    document.getElementById("inputEventImage").value = "";
                    notify("Event created successfully", "successBox");
                    window.location.hash = "#userHome";
                }
                else {
                    console.log(response.status);
                }

            })
            .catch(err => {
                console.error(err);
            });
    });
}
// organize();

function details(eventID) {
    console.log(eventID);
    notify("Loading...", "loadingBox");
    fetch(`https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events/${eventID}.json`)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("data:", data);
            data.id = eventID;
            let events = data;
            let source = document.getElementById("details-template").innerHTML;
            let template = Handlebars.compile(source);
            let context = events;
            let html = template(context);
            render(html);
            document.getElementById("loadingBox").classList.remove("active");
            if (currentUsername == data.organizerUsername) {
                document.getElementById("joinBtn").classList.add("invisible");
            }
            else if (currentUsername != data.organizerUsername) {
                document.getElementById("editBtn").classList.add("invisible");
                document.getElementById("closeBtn").classList.add("invisible");
            }
        })
        .catch(err => {
            console.error(err);
        });
}
// details();

function edit(eventID) {
    console.log(eventID);
    notify("Loading...", "loadingBox");
    fetch(`https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events/${eventID}.json`)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("data:", data);
            data.id = eventID;
            let events = data;
            let source = document.getElementById("edit-template").innerHTML;
            let template = Handlebars.compile(source);
            let context = events;
            let html = template(context);
            render(html);
            document.getElementById("loadingBox").classList.remove("active");

            document.getElementById("submit").addEventListener("click", function (event) {
                console.log("clicked");
                event.preventDefault();
                document.getElementById("errorBox").classList.remove("active");

                let name = document.getElementById("inputEventName").value;
                let dateTime = document.getElementById("inputEventDate").value;
                let description = document.getElementById("inputEventDescription").value;
                let imageURL = document.getElementById("inputEventImage").value;
                let regexN = /.{6,}/g;
                let regexDa = /^[0-3]{1}[0-9] [a-zA-Z]{3}$/g;
                let regexDi = /.{10,}/g;
                let regexI = /^http:\/\/|^https:\/\//g;
                if (!regexN.test(name)) {
                    notify("Event name must be at least 6 characters long", "errorBox");
                    return;
                }
                if (!regexDa.test(dateTime)) {
                    notify("Date must be in the format: DD MMM", "errorBox");
                    return;
                }
                if (!regexDi.test(description)) {
                    notify("Description must be at least 10 characters long", "errorBox");
                    return;
                }
                if (!regexI.test(imageURL)) {
                    notify("Image URL must start with: http:// or https://", "errorBox");
                    return;
                }
                let inputObj = {
                    name,
                    dateTime,
                    description,
                    imageURL,
                    interested: data.interested,
                    organizerUsername: currentUsername
                };
                let url = `https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events/${eventID}.json`;
                let headers = {
                    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputObj) // body data type must match "Content-Type" header
                };
                notify("Loading...", "loadingBox");
                fetch(url, headers)
                    .then(response => {
                        if (response.status == 200) {
                            console.log(response);
                            notify("Event edited successfully", "successBox");
                            window.location.hash = "#userHome";
                        }
                        else {
                            console.log(response.status);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        })
        .catch(err => {
            console.error(err);
        });

}
// edit();

function profile() {
    // GET events
    notify("Loading...", "loadingBox");
    fetch("https://mod4-project-13492-default-rtdb.asia-southeast1.firebasedatabase.app/events.json")
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("data:", data);
            if (data == null) {
                let source = document.getElementById("profile-template").innerHTML;
                let template = Handlebars.compile(source);
                let context = {};
                let html = template(context);
                render(html);
                document.getElementById("organizerOf").innerHTML = "Organizer of no events.";
            }
            else {
                // get template as handlebars string
                // convert data from object of objects into array of objects
                let events = Object.entries(data);
                // [ [events ID, object] ]  =>  [obj, obj, obj]
                events = events.map(arr => {
                    let [id, eventsObj] = arr;
                    eventsObj.id = id;
                    return eventsObj;
                })
                    // filter the users events only
                    .filter(obj => currentUsername == obj.organizerUsername);

                console.log("events array:", events);

                let source = document.getElementById("profile-template").innerHTML;
                let template = Handlebars.compile(source);
                let context = { events };
                console.log("context:", context);
                let html = template(context);
                render(html);
            }
            document.getElementById("profileUsername").innerText = currentUsername;
            document.getElementById("loadingBox").classList.remove("active");
        })
        .catch(err => {
            console.error(err);
        });
}
// profile();

function oops() {
    let source = document.getElementById("oops-template").innerHTML;
    let template = Handlebars.compile(source);
    let context = {};
    let html = template(context);
    render(html);
};
// oops();

function render(html) {
    document.getElementById("container").innerHTML = html;
}


