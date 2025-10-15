function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function to decode the JWT response
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: responsePayload.name,
            email: responsePayload.email,
            password: "google-auth"
        })
    }).then(res => res.json())
    .then(data => {
        if(data.message === "success"){
            localStorage.setItem('user', JSON.stringify(data.data));
            // You can now use the user's information to sign them in to your app
            // For example, you could send the ID token to your server to verify it and create a session

            // Redirect to the main page after successful login
            window.location.href = "index.html";
        } else {
            alert("Signup failed");
        }
    });
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
