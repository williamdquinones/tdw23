/**
 * Función que crea un elemento
 * @param form: Recibe un form con los datos para su creación
 * @returns {boolean}: true->todo bien / false->ver posibles fallos
 */
function createElements(form){
    let col = sessionStorage.getItem('create');
    let auth = sessionStorage.getItem('auth');
    let url = '/api/v1/'+col;
    let body = getDataFromForm(form);
    let checkboxProducts, checkboxPersons, checkboxEntities;
    let added = false;

    let xhr = new XMLHttpRequest();
    xhr.open('POST',url, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', auth);
    xhr.onload = () => {
        if (xhr.status === 201) {
            let response = JSON.parse(xhr.response);
            if(col==='products'){
                checkboxPersons = getIds('personasinvolucradas');
                checkboxEntities = getIds('entidadesinvolucradas');
                addInvolved(auth, col, response.product.id, 'persons', checkboxPersons[0]);
                addInvolved(auth, col, response.product.id, 'entities', checkboxEntities[0]);
            }
            else if(col === 'persons'){
                checkboxProducts = getIds('productosinvolucrados');
                checkboxEntities = getIds('entidadesinvolucradas');
                addInvolved(auth, col, response.person.id, 'products', checkboxProducts[0]);
                addInvolved(auth, col, response.person.id, 'entities', checkboxEntities[0]);
            }
            else{
                checkboxProducts = getIds('productosinvolucrados');
                checkboxPersons = getIds('personasinvolucradas');
                addInvolved(auth, col, response.entity.id, 'products', checkboxProducts[0]);
                addInvolved(auth, col, response.entity.id, 'persons', checkboxPersons[0]);
            }
            added = true;
            alert("Elemento creado correctamente");
        }
        else if(xhr.status === 400){
            alert("Error. Ya existe un elemento con este nombre.");
            form.name.focus();
        }
        else {
            alert('Error '+xhr.status+ '\n'+ JSON.parse(xhr.responseText).message);
        }
    };
    xhr.send(body);

    return added;
}

/**
 * Función que recorrerá las checkboxes del formulario y nos devolverá
 * aquellos checked y unchecked
 * @param name: definido en la función (personasinvolucradas, entidadesinvolucradas, productosinvolucrados)
 * @returns {*[][]}: [0]: checked; [1] unchecked
 */
function getIds(name){
    let idsChecked = [];
    let idsUnchecked = [];
    let names = document.getElementsByName(name);
    for(let i=0; i<names.length; i++){
        if(names[i].checked){
            idsChecked.push(parseInt(names[i].id.slice(-1)));
        }
        else{
            idsUnchecked.push(parseInt(names[i].id.slice(-1)));
        }
    }
    return [idsChecked, idsUnchecked];
}

/**
 * Función que agregará los elementos involucrados a un elemento.
 * @param auth: AuthHeader necesario para la petición
 * @param col: persons/entities/products para la petición PUT
 * @param id: id del elemento al que se desea añadir elementos involucrados
 * @param addTo: qué tipo de elemento involucrado se quiere añadir
 * @param arrayIds: array de ids de los elementos involucrados getIds[0]
 */
function addInvolved(auth, col, id, addTo, arrayIds){
    for(let i=0; i<arrayIds.length; i++) {
        let xhr = new XMLHttpRequest();
        let url = '/api/v1/'+col+'/'+id+'/'+addTo+'/add/'+arrayIds[i];

        xhr.open('PUT', url, false);
        xhr.setRequestHeader('Authorization', auth);
        xhr.onload = function (){
            if(xhr.status !== 209){
                alert("No ha sido posible agregar el elemento con id: "+id+"a "+col+"\n"+xhr.status);
            }
        }
        xhr.send(null);
    }
}

/**
 * Función que eliminará los elementos involucrados de un elemento.
 * @param auth: AuthHeader necesario para la petición
 * @param col: persons/entities/products para la petición PUT
 * @param id: id del elemento del que se desea eliminar elementos involucrados
 * @param addTo: qué tipo de elemento involucrado se quiere eliminar
 * @param arrayIds: array de ids de los elementos involucrados getIds[1]
 */
function remInvolved(auth, col, id, addTo, arrayIds){
    for(let i=0; i<arrayIds.length; i++) {
        let xhr = new XMLHttpRequest();
        let url = '/api/v1/'+col+'/'+id+'/'+addTo+'/rem/'+arrayIds[i];
        xhr.open('PUT', url, false);
        xhr.setRequestHeader('Authorization', auth);
        xhr.onload = function (){
            if(xhr.status !== 209){
                alert("No ha sido posible eliminar el elemento con id: "+id+"de "+col+"\n"+xhr.status);
            }
        }
        xhr.send(null);
    }
}

/**
 * Función que devolverá el array de elementos existentes de una categoría
 * @param auth: AuthHeader necesario para la petición
 * @param name: persons/entities/products para la petición
 * @returns {*[]}: array de elementos.
 */

function readElements(auth, name) {
    let elements=[];
    let xhr = new XMLHttpRequest();
    let url = '/api/v1/'+name;

    xhr.open('GET', url, false);
    xhr.setRequestHeader('Authorization', auth);
    xhr.onload = function () {
        if(xhr.status === 200){
            let response = JSON.parse(xhr.response);
            if(name!== 'entities'){
                elements = response[name].map(item => item[name.slice(0,-1)]);
            }
            else{
                elements = response[name].map(item => item['entity']);
            }
        }
        else{
            console.log('Error al obtener ' + name);
        }
    };
    xhr.send(null);
    return elements;
}

/**
 * Función que mostrará los elementos existentes
 * @param auth: AuthHeader necesario para la petición
 * @param role: diferencias entre writer y reader
 */
function showElements(auth, role){
    let products = readElements(auth, 'products');
    let persons = readElements(auth, 'persons');
    let entities = readElements(auth, 'entities');
    createCol(products, 'products', role);
    createCol(persons, 'persons', role);
    createCol(entities, 'entities', role);
}

/**
 * Función que nos creará las columnas en el menú
 * @param array: array de la columna específica
 * @param col: products/persons/entities
 * @param role diferenciar entre writer y reader
 */
function createCol(array, col, role){
    for(let item of array){
        let span = document.createElement('span');
        span.setAttribute('class', 'fs-5');
        span.appendChild(document.createTextNode(item.name));
        let img = document.createElement('img');
        img.setAttribute('src', item.imageUrl);
        img.setAttribute('alt', item.name);
        img.addEventListener('click', ()=>{ sessionStorage.setItem('show', col); showInfo(item, role);} );
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item my-1 bg-body-tertiary');
        li.setAttribute('id', col+item.id);
        li.appendChild(img);
        li.appendChild(span);
        let ul = document.getElementById(col).children[1]; /*0:h3; 1:ul*/
        ul.appendChild(li);
    }
}

/**
 * Función para actualizar un elemento
 * @param form: Formulario con los datos actualizados
 * @param col :persons/entities/products para la petición PUT
 * @param id: id del elemento a actualizar
 */
function updateElement(form, col, id){
    let auth = sessionStorage.getItem('auth');
    let url = '/api/v1/'+col+'/'+id;
    let body = getDataFromForm(form);
    let etag = getETag(id, col);
    let checkboxProducts, checkboxPersons, checkboxEntities;
    let xhr = new XMLHttpRequest();

    xhr.open('PUT', url, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('If-Match', etag);
    xhr.onload = function () {
        if(xhr.status === 209){
            alert('Modificado correctamente.');
            sessionStorage.removeItem("modified");
            sessionStorage.removeItem('create');
            if(col==='products'){
                checkboxPersons = getIds('personasinvolucradas');
                checkboxEntities = getIds('entidadesinvolucradas');
                addInvolved(auth, col, id, 'persons', checkboxPersons[0]);
                remInvolved(auth, col, id, 'persons', checkboxPersons[1]);
                addInvolved(auth, col, id, 'entities', checkboxEntities[0]);
                remInvolved(auth, col, id, 'entities', checkboxEntities[1]);
            }
            else if(col === 'persons'){
                checkboxProducts = getIds('productosinvolucrados');
                checkboxEntities = getIds('entidadesinvolucradas');
                addInvolved(auth, col, id, 'products', checkboxProducts[0]);
                remInvolved(auth, col, id, 'products', checkboxProducts[1]);
                addInvolved(auth, col, id, 'entities', checkboxEntities[0]);
                remInvolved(auth, col, id, 'entities', checkboxEntities[1]);
            }
            else{
                checkboxProducts = getIds('productosinvolucrados');
                checkboxPersons = getIds('personasinvolucradas');
                addInvolved(auth, col, id, 'products', checkboxProducts[0]);
                remInvolved(auth, col, id, 'products', checkboxProducts[1]);
                addInvolved(auth, col, id, 'persons', checkboxPersons[0]);
                remInvolved(auth, col, id, 'persons', checkboxPersons[1]);
            }
            location.href="./menu.html";
        }
        else{
            alert("No ha sido posible modificar el elemento.\n"+xhr.status);
        }
    }
    xhr.send(body);
}

/**
 * Función para eliminar un elemento
 * @param id: id del elemento a elimiar
 * @param col: persons/entities/products para la petición DELETE
 * @param auth: AuthHeader necesario para la petición
 */
function deleteElement(id, col, auth){
    if (confirm('¿Quieres eliminar este elemento?')){
        let url = '/api/v1/'+col+'/'+id;
        let xhr = new XMLHttpRequest();

        xhr.open('DELETE', url, false);
        xhr.setRequestHeader('Authorization', auth);
        xhr.onload = function () {
            if (xhr.status === 204) {
                alert('Elemento eliminado correctamente.');
                if(col !== 'users') {
                    location.reload();
                }
            }
            else{
                alert('No ha sido posible eliminar el elemento.');
            }
        };
        xhr.send(null);
    }
}
