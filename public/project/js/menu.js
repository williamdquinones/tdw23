/**
 * Función encargada de indicar el usuario logeado
 * así como de diferenciar entre writer y reader
 * y dependiendo de eso lanzar/no lanzar la creación de botones create/delete
 * y ocultar opciones en el desplegable.
 */
function onLoadMenu(){
    let auth = sessionStorage.getItem('auth');
    let data = getDataUserLogged(auth)
    let innerHTML = document.getElementById('welcome').innerHTML;
    innerHTML = innerHTML + '<i>'+ data.sub + '</i>';
    document.getElementById('welcome').innerHTML = innerHTML;

    let user = getUser(auth, data.uid);
    let role = user.role;

    showElements(auth, role);
    if(role === 'WRITER'){
        createDeleteButton(auth);
        createCreateButton();
    }
    else{
        document.getElementById('manageProfiles').style.display = 'none';
        document.getElementById('profRole').setAttribute('disabled', 'disabled');
        document.getElementById('profStatus').setAttribute('disabled', 'disabled');
    }

    console.log(user);
    document.getElementById('seeProfile').addEventListener("click", ()=>{ seeProfile(user, user.username)});
    document.getElementById('manageProfiles').addEventListener("click", ()=>{ manageProfiles(auth)});
}

/**
 * Función que devuelve un objeto data del auth (AuthHeader de la Autorización)
 * del usuario logeado actualmente.
 * @param auth
 * @returns {object}
 */
function getDataUserLogged(auth){
    let token = auth.split(' ')[1]; //Elimino 'Bearer'
    let data = JSON.parse(atob(token.split('.')[1]));
    return data;
}

/**
 * Función para cerrar sesión y salir del menú.
 */
function logOut(){
    location.href="../index.html";
    sessionStorage.removeItem('auth');
}

/**
 * Función que recupera los usuarios existentes para su posterior gestión.
 * @param auth
 */
function manageProfiles(auth){
    let users = readElements(auth, 'users');
    showManage(users);
}

/**
 * Función que crea un modal donde se visualizan los usuarios existentes
 * junto a botones para su gestión (ver, modificar y eliminar)
 * @param users
 */
function showManage(users){
    let ul = document.getElementById('users');
    ul.innerHTML = "";
    for(let user of users){
        let span = document.createElement('span');
        span.setAttribute('class', 'fs-4');
        span.appendChild(document.createTextNode(user.username));
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item my-1 bg-body-tertiary');
        let seeUpdateButton = document.createElement("button");
        seeUpdateButton.setAttribute('type', 'button');
        seeUpdateButton.setAttribute('class', 'btn btn-primary btn-sm mb-2 ms-2');
        seeUpdateButton.setAttribute('data-bs-toggle', 'modal');
        seeUpdateButton.setAttribute('data-bs-target', '#modalProfile');
        seeUpdateButton.appendChild(document.createTextNode("Ver/Modificar"));
        seeUpdateButton.addEventListener('click', ()=>{seeProfile(user, user.username)});
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'btn btn-danger btn-sm mb-2 ms-2');
        deleteButton.appendChild(document.createTextNode("Eliminar"));
        deleteButton.addEventListener('click', ()=>{
            deleteElement(user.id, 'users', sessionStorage.getItem('auth'));
            manageProfiles(sessionStorage.getItem('auth'));
        });
        li.appendChild(span);
        li.appendChild(seeUpdateButton);
        li.appendChild(deleteButton);
        ul.appendChild(li);
    }
}

/**
 * Función que permitirá ver en un modal los datos de un usuario seleccionado
 * @param user: Usuario seleccionado
 * @param username: Username del usuario. Esto es para controlar que si es el
 * mismo usuario logeado, vea el mensaje "Datos de tu perfil"
 */
function seeProfile(user, username){
    document.getElementById('profileSaveChanges').addEventListener('click', ()=> {modifyDataUser(user)});
    if(username !== getDataUserLogged(sessionStorage.getItem('auth')).sub){
        document.getElementById('profTitle').innerHTML = "Datos del perfil " + username;
    }
    else{
        document.getElementById('profTitle').innerHTML = "Datos de tu perfil";
    }
    document.getElementById('profUsername').value = user.username;
    document.getElementById('profName').value = user.name;
    document.getElementById('profBirthDate').value = user.birthDate;
    document.getElementById('profEmail').value = user.email;
    document.getElementById('profUrl').value = user.userUrl;
    document.getElementById('profPass').value = user.password;
    document.getElementById('profRole').value = user.role;
    document.getElementById('profStatus').value = user.status;

}

/**
 * Función para mostrar/ocultar la contraseña del usuario
 * mediante una checkbox
 */
function showPass(){
    let input = document.getElementsByClassName('passwd');
    for(let i=0; i<input.length; i++){
        if(input[i].type === 'password'){
            input[i].type = 'text';
        }
        else{
            input[i].type = 'password';
        }
    }
}

/**
 * Función que modifica los datos mostrados en el modal.
 * @param user: Usuario a actualizar los datos, también para coger su id
 * que es necesario para hacer la petición PUT
 */
function modifyDataUser(user){
    let auth = sessionStorage.getItem('auth');
    let body = {
        username: document.getElementById('profUsername').value,
        name: document.getElementById('profName').value,
        birthDate:document.getElementById('profBirthDate').value,
        email: document.getElementById('profEmail').value,
        userUrl: document.getElementById('profUrl').value,
        password: document.getElementById('profPass').value,
        role: document.getElementById('profRole').value,
        status: document.getElementById('profStatus').value
    }
    let id = user.id;
    let etagUser = getETag(id, 'users');
    let xhr = new XMLHttpRequest();
    let url = '/api/v1/users/'+id;

    xhr.open('PUT', url, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('If-Match', etagUser);
    xhr.onload = function () {
        if(xhr.status === 209){
            alert('Modificado correctamente.');
            location.reload();
        }
        else{
            alert('Error '+xhr.status+'\nEste correo ya existe, prueba con otro.');
        }
    }
    xhr.send(JSON.stringify(body));

}

/**
 * Función para crear los botones de delete.
 * @param auth: Necesario para la petición DELETE
 */
function createDeleteButton(auth){
    for(let li of document.getElementsByClassName('list-group-item')){
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'btn btn-danger btn-sm ms-2');
        deleteButton.appendChild(document.createTextNode("delete"));
        let col = li.parentNode.parentNode.id;
        let id = li.id.replace(col,'');
        deleteButton.addEventListener('click', deleteElement.bind(this, id, col, auth));
        li.appendChild(deleteButton);
    }
}

/**
 * Función para crear los botones de create.
 */
function createCreateButton(){
    for(let div of document.getElementById('main').children){
        let createButton = document.createElement("button");
        createButton.setAttribute('type', 'button');
        createButton.setAttribute('class', 'btn btn-secondary btn-lg');
        createButton.appendChild(document.createTextNode("create"));
        createButton.addEventListener('click', formToCreate.bind(this, div.id));
        div.appendChild(createButton);
    }
}

/**
 * Función que se lanza al pulsar el botón create, nos redireccionará
 * al formulario para la creación del elemento.
 * @param col: Columna/elemento a crear (products/persons/entities)
 */
function formToCreate(col){
    console.log('crear en: '+col);
    sessionStorage.setItem("create", col);
    location.href="../html/form.html";
}

/**
 * Función que nos mostrará la información de un elemento al hacer
 * click sobre él.
 * @param item: Elemento a mostrar
 * @param role: Si es writer, podremos modificarlo posteriormente.
 */
function showInfo(item, role){
    document.getElementById('body').innerHTML="";

    let divData = document.createElement('div');
    divData.setAttribute('class', 'col-md-7');
    let name = createHtmlElement(item.name, "Nombre");
    let bDate = createHtmlElement(convertDate(item.birthDate), "Fecha de nacimiento");
    divData.appendChild(name);
    divData.appendChild(bDate);
    if(item.deathDate != null){
        let dDate = createHtmlElement(convertDate(item.deathDate), "Fecha de defunción");
        divData.appendChild(dDate);
    }

    let productsInvolved;
    let personsInvolved;
    let entitiesInvolved;

    if(item.persons != null) {
        personsInvolved = createHtmlListInvolved(item.persons, 'persons');
        divData.appendChild(createHtmlElement("", "Personas involucradas"));
        divData.appendChild(personsInvolved);
    }
    if(item.entities != null) {
        entitiesInvolved = createHtmlListInvolved(item.entities, 'entities');
        divData.appendChild(createHtmlElement("", "Entidades involucradas"));
        divData.appendChild(entitiesInvolved);
    }
    if(item.products!= null){
        productsInvolved = createHtmlListInvolved(item.products, 'products');
        divData.appendChild(createHtmlElement("", "Productos involucrados"));
        divData.appendChild(productsInvolved);
    }

    let divImg = document.createElement('div');
    divImg.setAttribute('class', 'col-md-5');
    let figure = document.createElement('figure');
    figure.setAttribute('class', 'figure');
    let img = document.createElement('img');
    img.setAttribute('src', item.imageUrl);
    img.setAttribute('class', 'figure-img img-fluid rounded');
    img.setAttribute('alt', item.name);
    img.setAttribute('width', '90%');
    let figcaption = document.createElement('figcaption');
    figcaption.setAttribute('class', 'figure-caption');
    figcaption.appendChild(document.createTextNode(item.name));
    figure.appendChild(img);
    figure.appendChild(figcaption);
    divImg.appendChild(figure);

    let divDataImgRow = document.createElement('div');
    divDataImgRow.setAttribute('class', 'row');
    divDataImgRow.appendChild(divData);
    divDataImgRow.appendChild(divImg);

    let divDataImg = document.createElement('div');
    divDataImg.setAttribute('class', 'col-md-7');
    divDataImg.appendChild(divDataImgRow);

    let divWiki = document.createElement('div');
    divWiki.setAttribute('class', 'col-md-5');
    let divFrame = document.createElement('div');
    divFrame.setAttribute('class', 'ratio ratio-4x3');
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', item.wikiUrl);
    divFrame.appendChild(iframe);
    divWiki.appendChild(divFrame);

    let divAllData = document.createElement('div');
    divAllData.setAttribute('class', 'row mt-3 mb-3');
    divAllData.appendChild(divDataImg);
    divAllData.appendChild(divWiki);

    let backButton = document.createElement('button');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('class', 'btn btn-secondary mb-3');
    backButton.appendChild(document.createTextNode('Atrás'));
    backButton.addEventListener('click', backToMenu);

    let divContainer = document.createElement('div');
    divContainer.setAttribute('class', 'container col-md-8 mt-3 border rounded-3 bg-body-tertiary');
    divContainer.appendChild(divAllData);
    divContainer.appendChild(backButton);

    if(role === 'WRITER'){
        let modifyButton = document.createElement('button');
        modifyButton.setAttribute('type', 'button');
        modifyButton.setAttribute('class', 'btn btn-secondary mb-3 float-end');
        modifyButton.appendChild(document.createTextNode('Modificar'));
        modifyButton.addEventListener('click', ()=>{ formToModify(item, sessionStorage.getItem('show')) } );
        divContainer.appendChild(modifyButton);
    }
    document.getElementById('body').appendChild(divContainer);
}

/**
 * Función que se lanza al pulsar el botón Modificar, nos redireccionará
 * al formulario para la modificación del elemento.
 * @param item: Elemento a ser modificado
 * @param col: Columna/elemento a modificar (products/persons/entities)
 */
function formToModify(item, col){
    sessionStorage.setItem('create', col);
    sessionStorage.setItem("modified", JSON.stringify(item));
    sessionStorage.removeItem('show');
    location.href="./form.html";
}

/**
 * Función llamada en showInfo que nos creará los títulos
 * para cada atributo del elemeto.
 * @param value: Valor del atributo del elemento (name, birthDate, etc)
 * @param text: Título para el atributo(Nombre, Fecha de nacimiento, etc)
 * @returns {HTMLHeadingElement}: un h5 con Título: atributo
 */
function createHtmlElement(value, text){
    let h5 = document.createElement('h5');
    let span = document.createElement('span');
    span.setAttribute('class', 'text-decoration-underline');
    span.appendChild(document.createTextNode(text));
    h5.appendChild(span);
    h5.appendChild(document.createTextNode(": "+value));

    return h5;
}

/**
 * Función llamada en showInfo que nos creará una lista
 * con los otros elementos involucrados
 * @param array: Array con los ids de los elementos involucrados de una misma categoría
 * @param elem: Qué elemento involucrado es (products/persons/entities)
 * @returns {HTMLUListElement}: una ul con los elementos involucrados
 */
function createHtmlListInvolved(array, elem){
    let ul = document.createElement('ul');
    ul.setAttribute('class', 'list-group mb-3');
    for(let id of array){
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item bg-body-tertiary');
        let name = getNameFromId(id, elem);
        li.appendChild(document.createTextNode(name));
        ul.appendChild(li);
    }

    return ul;
}

/**
 * Función que nos devuelve el nombre de un elemento, se utiliza en la función
 * createHtmlListInvolved() ya que el array recibido en esa función es de ids.
 * @param id: id del elemento
 * @param elem: products/persons/entities para la petición
 * @returns {*}: nombre del elemento de acuerdo a su id
 */
function getNameFromId(id, elem){
    let name;
    let xhr = new XMLHttpRequest();
    let url = '/api/v1/'+elem+'/'+id;
    xhr.open('GET', url, false);
    xhr.onload = function (){
        if(xhr.status === 200){
            let response = JSON.parse(xhr.response);
            if(elem!== 'entities'){
                name = response[elem.slice(0,-1)].name;
            }
            else{
                name = response['entity'].name;
            }
        }
        else{
            alert("Error " + xhr.status);
            name = null;
        }
    }
    xhr.send(null);
    return name;
}

