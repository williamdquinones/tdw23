/**
 * Función donde se agregarán al formulario los elementos involucrados existentes
 * para añadir a un elemento en concreto. Además, si se modifica un elemento,
 * estos involucrados estarán checked
 */
function onLoadForm(){
    let auth = sessionStorage.getItem('auth');
    let form = document.getElementById('form');
    let col = sessionStorage.getItem('create');
    let products = readElements(auth, 'products');
    let persons = readElements(auth, 'persons');
    let entities = readElements(auth, 'entities');
    let checkProducts = createCheckBox(products, 'Productos involucrados');
    let checkPersons = createCheckBox(persons, 'Personas involucradas');
    let checkEntities = createCheckBox(entities, 'Entidades involucradas');
    switch (col){
        case 'products':
            document.getElementById('title').innerHTML="Datos del nuevo producto";
            form.insertBefore(checkPersons, document.getElementsByTagName('button')[0]);
            form.insertBefore(checkEntities, document.getElementsByTagName('button')[0]);
            break;
        case 'persons':
            document.getElementById('title').innerHTML="Datos de la nueva persona";
            form.insertBefore(checkProducts, document.getElementsByTagName('button')[0]);
            form.insertBefore(checkEntities, document.getElementsByTagName('button')[0]);
            break;
        default:
            document.getElementById('title').innerHTML="Datos de la nueva entidad";
            form.insertBefore(checkProducts, document.getElementsByTagName('button')[0]);
            form.insertBefore(checkPersons, document.getElementsByTagName('button')[0]);
    }
    if(sessionStorage.getItem("modified")!=null){
        let item = JSON.parse(sessionStorage.getItem("modified"));
        document.getElementById('title').innerHTML  = 'Modificando "' + item.name+ '"';
        let arrayKeys = Object.keys(item);
        let arrayValues = Object.values(item);

        for(let i=1; i<6; i++){
            document.getElementById(arrayKeys[i]).value = arrayValues[i];
        }

        switch (col){
            case 'products':
                checkValues(item, 'persons');
                checkValues(item, 'entities');
                break;
            case 'persons':
                checkValues(item, 'products');
                checkValues(item, 'entities');
                break;
            default:
                checkValues(item, 'products');
                checkValues(item, 'persons');
        }
        document.getElementById('submit').innerHTML="Guardar cambios";
        form.onsubmit = ()=>{updateElement(form, col, item.id)};
    }
}

/**
 * Función que pone como checked aquellos elementos involucrados de un elemento en particular
 * @param item: Elemento a modificar
 * @param element: atributo de involucrado(products/entities/persons)
 */
function checkValues(item, element){
    let names;
    switch (element){
        case 'products':
            let products = item[element];
            if(products != null){
                names = document.getElementsByName('productosinvolucrados');
                for(let i=0; i<products.length; i++){
                    for(let j=0; j<names.length; j++){
                        if(products[i] == names[j].id.slice(-1)){ //int 1 == string 1
                            names[j].setAttribute('checked', 'checked');
                        }
                    }
                }
            }
            break;
        case 'persons':
            let persons = item[element];
            if(persons != null) {
                names = document.getElementsByName('personasinvolucradas');
                for (let i = 0; i < persons.length; i++) {
                    for (let j = 0; j < names.length; j++) {
                        if (persons[i] == names[j].id.slice(-1)) { //int 1 == string 1
                            names[j].setAttribute('checked', 'checked');
                        }
                    }
                }
            }
            break;
        default:
            let entities = item[element];
            if(entities != null) {
                names = document.getElementsByName('entidadesinvolucradas');
                for (let i = 0; i < entities.length; i++) {
                    for (let j = 0; j < names.length; j++) {
                        if (entities[i] == names[j].id.slice(-1)) { //int 1 == string 1
                            names[j].setAttribute('checked', 'checked');
                        }
                    }
                }
            }
    }

}

/**
 * Función que recoge los datos en común de todos los elementos
 * y lo devuelve en formato json string
 * @param form: Formulario con los datos para crear/modificar
 * @returns {string}: Valores comunes para los elementos en formato string json
 */
function getDataFromForm(form){
    let body = {
        name: form.name.value,
        birthDate: form.birthDate.value,
        deathDate: form.deathDate.value,
        imageUrl: form.imageUrl.value,
        wikiUrl: form.wikiUrl.value
    }
    return JSON.stringify(body);
}

/**
 * Función que crea las checkboxes de los elementos existentes
 * para agregar/modificar elementos involucrados
 * @param array: array de elementos de uno en particular
 * @param text: Label de las checkbox (Personas involucradas, Productos involucrados, Entidades involucradas)
 * @returns {HTMLDivElement}
 */
function createCheckBox(array, text){
    let div = document.createElement('div');
    div.setAttribute('class', 'mb-3');
    let label = document.createElement('label');
    label.setAttribute('class', 'form-label');
    label.appendChild(document.createTextNode(text+':'));
    div.appendChild(label);

    if(array.length>0){
        for(let element of array){
            let divBox = document.createElement('div');
            divBox.setAttribute('class', 'form-check');
            let input = document.createElement('input');
            input.setAttribute('class', 'form-check-input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', noSpecialCharacters(text).toLowerCase());
            input.setAttribute('id', noSpecialCharacters(element.name)+element.id);
            input.setAttribute('value', element.name);
            let labelBox = document.createElement('label');
            labelBox.setAttribute('class', 'form-check-label');
            labelBox.setAttribute('for', noSpecialCharacters(element.name));
            labelBox.appendChild(document.createTextNode(element.name));
            divBox.appendChild(input);
            divBox.appendChild(labelBox);
            div.appendChild(divBox);
        }
    }
    else{
        label.innerHTML = label.innerHTML + " Actualmente no existen.";
    }

    return div;
}