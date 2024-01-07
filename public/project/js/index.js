/**
 * Al iniciar, ocultamos la mitad del formulario del registro
 * y el botón para crear un usuario.
 */
function onLoadIndex(){
    document.getElementById('completeNewData').style.display='none';
    document.getElementById('postUser').style.display='none';
}

/**
 * Valida el par username/password
 * y accede al sistema si este par es correcto
 * y si el usuario no presenta un estado inactivo.
 * @returns {boolean}
 */
function validate(){
    let validate = false;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let xhr = new XMLHttpRequest();

    xhr.open('POST','/access_token', false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function (){
        if (xhr.status === 200) {
            let auth = xhr.getResponseHeader('Authorization');
            sessionStorage.setItem('auth', auth);
            validate = true;
        }
        else if (xhr.status === 403){
            alert(JSON.parse(xhr.response).error_description);
            document.getElementById('username').focus();
        }
        else {
            alert('Credenciales incorrectas.');
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            document.getElementById('username').focus();
        }
    };
    xhr.send("username="+username+"&password="+password);

    return validate;
}

/**
 *
 * @param String auth
 * @returns {int}: id del usuario
 */
function getUserId(auth){
    let token = auth.split(' ')[1]; //Elimino 'Bearer'
    let data = JSON.parse(atob(token.split('.')[1]));

    return data.uid;
}


