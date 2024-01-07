/**
 * Al recibir la fecha del formulario o de una petición
 * la convertimos al formato dd/mm/yyyy para fines de visualización
 * @param date Format yyyy-mm-dd
 * @returns {string}
 */
function convertDate(date){
    /*date: yyyy-mm-dd */
    let array = date.split('-');
    let dd = array[2];
    let mm = array[1];
    let yyyy = array[0];

    return dd+'/'+mm+'/'+yyyy;
}

/**
 * Devolverá el ETag de un elemento o usuario donde pasamos el id de este.
 * @param id -> identificador del elemento o usuario que queremos recuperar
 * @param col -> hacia dónde queremos hacer la petición (products, persons, entities o users)
 * @returns {string}
 */
function getETag(id, col){
    let xhr = new XMLHttpRequest();
    let url = '/api/v1/'+col+'/'+id;
    let auth = sessionStorage.getItem('auth');
    let etag = "";

    xhr.open('GET', url, false);
    xhr.setRequestHeader('Authorization', auth);
    xhr.onload = function (){
        if(xhr.status === 200){
            etag = xhr.getResponseHeader('ETag');
        }
        else{
            alert('No ha sido posible recuperar el ETag.\n'+xhr.status);
        }
    }
    xhr.send(null);
    return etag;
}

/**
 * Valida si la passsword que insertamos al crear/modificar un usuario cumple con la expresión regular dada
 * @param password
 * @returns {boolean}
 */
function passwordIsValid(password){
    //min 8 caracteres, min 1 caracter especial y min 1 numero y min 1 mayus
    let patternPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    return patternPass.test(password);
}

/**
 * Elimina caracteres especiales de un string
 * Sirve para colocar como atributo id de un elemento para diferenciarlo
 * @param string: Nombre del elemento
 * @returns {*}: String solo con letras y números
 */
function noSpecialCharacters(string){
    return string.replace(/[^a-zA-Z0-9]+/g,"");
}

/**
 * Función que devuelve un usuario acorde a su id
 * @param auth: AuthHeader necesario para la petición
 * @param uid: id del usuario
 * @returns {object} objeto usuario
 */
function getUser(auth, uid){
    let dataUser = null;
    let xhr = new XMLHttpRequest();
    let url = '/api/v1/users/'+uid;
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Authorization', auth);
    xhr.onload = function () {
        if(xhr.status === 200){
            let response = JSON.parse(xhr.response);
            dataUser = response['user'];
        }
        else{
            alert('Error. \n'+ JSON.parse(xhr.responseText).message);
        }
    }
    xhr.send(null);
    return dataUser;
}

/**
 * Función para regresar al menú principal, ya sea cuando estemos
 * viendo la información del elemento o creando/modificando un elemento.
 */
function backToMenu(){
    location.href = "./menu.html";
    sessionStorage.removeItem('show');
    sessionStorage.removeItem('modified');
    sessionStorage.removeItem('create');
}