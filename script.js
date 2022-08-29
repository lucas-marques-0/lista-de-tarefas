/* alert("Olá Lucas! BOM DIA, espero que tenha dormido bem! esses são seus avisos e tarefas...");
let senha = prompt("Só para certificar que realmente é o você, digite a senha...");
while(senha != "3008"){
    alert("SENHA INCORRETA!");
    senha = prompt("Tente digitar a senha mais uma vez...");
}
if(senha == "3008"){
    let fundo = document.querySelector(".fundo");
    fundo.style.display = "none";
    let mensagem = document.querySelector(".senha_correta");
    mensagem.style.display = "inline-block";
    setInterval(() => {
        mensagem.style.opacity = "0";
    }, 3000);
}
*/

let inputNovaTarefa = document.querySelector('.input_tarefa');
let botaoAdicionarTarefa = document.querySelector('.btn_adicionar_tarefa');
let botaoLimparTudo = document.querySelector(".btn_limpar_tudo");
let listaTarefas = document.querySelector('.lista_tarefas');

let janelaEdicao = document.querySelector('.janela_edicao');
let janelaEdicaoFundo = document.querySelector('.janela_edicao_fundo');
let botaoFecharEdicao = document.querySelector('.btn_fechar_edicao');
let botaoAplicarEdicao = document.querySelector('.btn_aplicar_edicao');
let idTarefaEdicao = document.querySelector('.id_tarefa_edicao');
let inputTarefaEdicao = document.querySelector('.input_tarefa_edicao');

let localStorageTarefas = [];
obterTarefasLocalStorage();
renderizarListaTarefasHtml();

inputNovaTarefa.addEventListener("keypress", (elemento) => {
    if(elemento.keyCode == 13){
        let tarefa = {
            nome: inputNovaTarefa.value,
            id: criarId(),
        }
        if(inputNovaTarefa.value == ""){
            alert("digite um valor válido");
        } else {
            adicionarTarefa(tarefa);
        }
    }
});

botaoAdicionarTarefa.addEventListener("click", (elemento) => {
    let tarefa = {
        nome: inputNovaTarefa.value,
        id: criarId(),
    }
    if(inputNovaTarefa.value == ""){
        alert("digite um valor válido");
    } else {
        adicionarTarefa(tarefa);
    }
});

botaoLimparTudo.addEventListener("click", () => {
    confirm("Realmente deseja limpar todo o quadro?");
    if(confirm){
        localStorage.clear();
        location.reload();
    }
});

function criarId(){
    return Math.floor(Math.random() * 3000);
}

function adicionarTarefa(tarefa){
    localStorageTarefas.push(tarefa);
    salvarTarefasLocalStorage();
    renderizarListaTarefasHtml();
}

function salvarTarefasLocalStorage(){
    localStorage.setItem("listaDeTarefas", JSON.stringify(localStorageTarefas));
}

function renderizarListaTarefasHtml(){
    listaTarefas.innerHTML = "";
    for(let i=0; i<localStorageTarefas.length; i++){
        let li = criarTagLista(localStorageTarefas[i]);
        listaTarefas.appendChild(li);
    }
    inputNovaTarefa.value = "";
}

function obterTarefasLocalStorage(){
    if(localStorage.getItem("listaDeTarefas")){
        localStorageTarefas = JSON.parse(localStorage.getItem("listaDeTarefas"));
    }
}

function criarTagLista(tarefa){
    let li = document.createElement("li");
    li.id = tarefa.id; 

    let span = document.createElement("span");
    span.classList.add("texto_tarefa");
    span.innerHTML = tarefa.nome;

    let div = document.createElement("div");

    let btnEditar = document.createElement("button");
    btnEditar.classList.add("btn_editar");
    btnEditar.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEditar.setAttribute("onclick", "editar("+ tarefa.id +")");

    let btnExcluir = document.createElement("button");
    btnExcluir.classList.add("btn_excluir");
    btnExcluir.innerHTML = '<i class="fa fa-trash"></i>';
    btnExcluir.setAttribute("onclick", "excluir("+ tarefa.id +")");

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(div);

    return li;
}

function editar(idTarefa){
    let li = document.getElementById(idTarefa);
    if(li){ 
        idTarefaEdicao.innerHTML = "#" + idTarefa;
        inputTarefaEdicao.value = li.innerText;
        alternarJanelaEdicao();
    } else {
        alert("Elemento HTML não encontrado!");
    }
}

function excluir(idTarefa){
    let confirmacao = window.confirm("Tem certeza que deseja excluir? ");
    if(confirmacao){
        let indiceTarefa = localStorageTarefas.findIndex(tarefa => tarefa.id == idTarefa);
        if(indiceTarefa < 0){//se não é encontrada recebe "-1"
            throw new Error("id da tarefa não encontrado: ", idTarefa);
        } else {
            localStorageTarefas.splice(indiceTarefa, 1);
            salvarTarefasLocalStorage();
        }

        let li = document.getElementById(idTarefa);
        if(li){
            listaTarefas.removeChild(li);
        } else {
            alert("Elemento HTML não encontrado!");
        }
    }
}

function alternarJanelaEdicao(){
    janelaEdicao.classList.toggle('abrir');
    janelaEdicaoFundo.classList.toggle('abrir');
}

botaoAplicarEdicao.addEventListener("click", (elemento) => {
    elemento.preventDefault();
    let idTarefa = idTarefaEdicao.innerHTML.replace("#", "");
    let tarefa = {
        nome: inputTarefaEdicao.value,
        id: idTarefa,
    };
    let tarefaAtual = document.getElementById(idTarefa);
    if(tarefaAtual){
        let indiceTarefa = localStorageTarefas.findIndex(tarefa => tarefa.id == idTarefa);
        localStorageTarefas[indiceTarefa] = tarefa;
        salvarTarefasLocalStorage();

        let li = criarTagLista(tarefa);
        listaTarefas.replaceChild(li, tarefaAtual);
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado!');
    }
});

botaoFecharEdicao.addEventListener("click", (elemento) => {
    alternarJanelaEdicao();
});
