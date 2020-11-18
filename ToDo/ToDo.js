<<<<<<< HEAD:ToDo/ToDo.js
function newToDo(){
    let inputText = document.getElementById("inputText").value;
    const todoElement = new ToDo(inputText);
    document.getElementById('inputText').value = ''
}

class ToDo{

    constructor(text){
        this.text = text;
        this.div = document.createElement('div');
        this.div.setAttribute('id', 'ToDo');
        this.createToDo();
    }

    createToDo() {
        // V button to complete to do
        const buttonV = document.createElement('button');
        buttonV.innerHTML = "V";
        buttonV.setAttribute('id', 'VButton');
        buttonV.onclick = this.completeToDo;
        this.div.appendChild(buttonV);

        // to do text
        this.todoText = document.createElement('span');
        this.todoText.innerHTML = this.text;
        this.todoText.setAttribute('id', 'ToDoText');
        this.div.appendChild(this.todoText);

        // X button to remove to do
        const buttonX = document.createElement('button');
        buttonX.innerHTML = "X";
        buttonX.setAttribute('id', 'XButton');
        buttonX.onclick = this.removeToDo;
        this.div.appendChild(buttonX);

        // add div to do
        document.body.appendChild(this.div);

    }

    completeToDo = () => {
        this.todoText.setAttribute('id', 'finishedToDo');
    }

    removeToDo = () => {
        this.div.remove();
    }
=======
function newToDo(){
    let inputText = document.getElementById("inputText").value;
    const todoElement = new ToDo(inputText);
    document.getElementById('inputText').value = ''
}

class ToDo{

    constructor(text){
        this.text = text;
        this.div = document.createElement('div');
        this.div.setAttribute('id', 'ToDo');
        this.createToDo();
    }

    createToDo() {
        // V button to complete to do
        const buttonV = document.createElement('button');
        buttonV.innerHTML = "V";
        buttonV.setAttribute('id', 'VButton');
        buttonV.onclick = this.completeToDo;
        this.div.appendChild(buttonV);

        // to do text
        this.todoText = document.createElement('span');
        this.todoText.innerHTML = this.text;
        this.todoText.setAttribute('id', 'ToDoText');
        this.div.appendChild(this.todoText);

        // X button to remove to do
        const buttonX = document.createElement('button');
        buttonX.innerHTML = "X";
        buttonX.setAttribute('id', 'XButton');
        buttonX.onclick = this.removeToDo;
        this.div.appendChild(buttonX);

        // add div with to do
        document.body.appendChild(this.div);

    }

    completeToDo = () => {
        this.todoText.setAttribute('id', 'finishedToDo');
    }

    removeToDo = () => {
        this.div.remove();
    }
>>>>>>> fa87c804dac6d7a722e7800121dd9f4ba0edd05b:ToDo/ToDo.js
}