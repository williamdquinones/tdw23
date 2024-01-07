
/**
 * Verificamos si el username se encuentra disponible
 * true: Mostramos el formulario completo para seguir completando datos
 * false: Pedimos que vuelva a introducir otro username
 */
function verifyData(){
    let newUser = document.getElementById('newUser').value;
    let newPassword = document.getElementById('newPass').value;

    if(usernameIsValid(newUser)){
        if(passwordIsValid(newPassword)) {
            let xhr = new XMLHttpRequest();
            let url = '/api/v1/users/username/' + newUser;

            xhr.open('GET', url, false);
            xhr.onload = function () {
                if (xhr.status === 204) {
                    alert('Este username ya existe.\nPrueba con otro, por favor.');
                    document.getElementById('newUser').focus();
                } else {
                    alert('Username disponible.\nPuedes continuar rellenando los datos');
                    document.getElementById('newUser').setAttribute('disabled', 'disabled');
                    document.getElementById('verifyData').style.display = 'none';
                    document.getElementById('completeNewData').style.display = 'inline';
                    document.getElementById('postUser').style.display = 'inline';
                    document.getElementById('postUser').addEventListener('click', () => {
                        createUser();
                    });
                }
            }
            xhr.send(null);
        }
        else{
            alert('La contraseña debe tener mínimo 8 caracteres y cumplir:\n- Al menos una mayúscula.\n- Al menos un número.\n- Al menos un carácter especial (!@#$%^&*)');
        }
    }
    else{
        alert('El usuario sólo admite:\nMayúsculas y minúsculas. (ñ/Ñ incluidas)\nTildes en vocales mayúsculas y minúsculas.\nLos caractéres especiales: % $ . + -');
    }

}

/**
 * Una vez rellenados todos los campos del formulario, creamos el usuario.
 */
function createUser(){
    let username = document.getElementById('newUser').value;
    let password = document.getElementById('newPass').value;
    let birthDate = document.getElementById('newBirthdate').value;
    let email = document.getElementById('newEmail').value;
    let userUrl = document.getElementById('newUrl').value;
    let name = document.getElementById('newName').value;
    alert(birthDate.length);
    let allOK = (usernameIsValid(username) && passwordIsValid(password) && birthDate.length!==0 && email.length!==0 && userUrl.length!==0 && name.length!==0);
    if(allOK){
        let auth = getAuthAdmin();
        let body = {
            username: username,
            name: name,
            birthDate: birthDate,
            email: email,
            userUrl: userUrl,
            password: password,
            role: 'READER',
            status: 'INACTIVE'
        };
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/api/v1/users', false);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader('Authorization', auth);
        xhr.onload = function (){
            alert(xhr.status);
            if(xhr.status === 201){
                alert('Creado correctamente');
                location.reload();
            }
            else{
                alert('Error al crear el usuario.\nRevisa los datos, por favor.');
            }
        }
        xhr.send(JSON.stringify(body));
    }
    else{
        alert('Revisa que los datos estén correctos o completa todos los campos, por favor.');
    }
}

/**
 * Para hacer createUser() necesitamos la cabecera Authorization
 * por lo que la capturamos mediante un post de adminUser
 * @returns auth
 */
function getAuthAdmin(){
    let auth;
    let xhr = new XMLHttpRequest();

    xhr.open('POST','/access_token', false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function (){
        if (xhr.status === 200) {
            auth = xhr.getResponseHeader('Authorization');
        }
    };
    xhr.send("username=adminUser&password=adminUser33!");

    return auth;
}

/**
 * Valida si el username que queremos crear cumple con la expresión regular dada
 * @param String username
 * @returns {boolean}
 */
function usernameIsValid(username){
    let patternUser = /^[a-zA-Z0-9()áéíóúÁÉÍÓÚñÑ %\$\.+-]+$/;

    return patternUser.test(username);
}

