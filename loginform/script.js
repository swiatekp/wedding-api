const form = document.querySelector('form');
const errorPrompt = document.querySelector('.error-prompt');

form.addEventListener('submit', e => {
    e.preventDefault();

    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;

    fetch('http://localhost:2137/login', {
        method: 'POST',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            login, password
        })
    })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.error) throw Error(resp.error)
            else {
                errorPrompt.innerText = "";
                errorPrompt.style.display = "none";

                window.location.replace(`../admin?bearer=${resp.token}`);
            }
        })
        .catch(err => {
            errorPrompt.style.display = "block";
            errorPrompt.innerText = err.message;
        });
})