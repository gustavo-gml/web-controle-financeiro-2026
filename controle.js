const form = document.getElementById("form"); //boa pratica declarar como const 
// document é um objeto de contexto sobre a pagina para acesso aos objetos
// todas as classes js tem seu respectivo objeto que são retornadas ao usar o getelments
// pegamos o form para o comprtamento do submit
const descInput = document.querySelector('#descricao'); // outra forma de pegar o imput
const valorInput = document.getElementById("montante");
const balancoH1 = document.getElementById('balanco');
const receitaP = document.getElementById('din-positivo');
const despesaP = document.getElementById('din-negativo');
const transacoesUl = document.getElementById('transacoes')

const chave_transacoes_ls = 'transacoes' //constante nome do ponteiro para o localstorage
let transacoesSalvas;
try {
    transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_ls));

} catch (error) {
    transacoesSalvas = null;
}

if (transacoesSalvas == null || transacoesSalvas == undefined) {
    transacoesSalvas = [];
}

form.addEventListener("submit", (e) => {
    e.preventDefault(); //sequestra o evento padrão de envio

    const descTransacao = descInput.value;
    let valorTransacao = Math.abs(valorInput.value);

    // Fail Fast: sempre que mexer com api externa, valide tudo logo no 
    // inicio do método, antes de qualquer coisa
    if (descTransacao == "" || valorTransacao == "") {
        alert('Descrição e valor não podem ser vazios.');
        return; // sempre mata o método
    }

    //limpa 
    descInput.value = "";
    valorInput.value = "";

    const botaoSubmit = document.activeElement; 
    const idDoBotao = botaoSubmit.id;

    
    if (idDoBotao == "btn-despesa"){
        valorTransacao = -valorTransacao
    }
    //objeto literal
    const transacao = {
        id: parseInt(gerarProximoID()),
        descricao: descTransacao,
        valor: parseFloat(valorTransacao)
    }

    

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao, idDoBotao);
    addTransacaoAoDOM(transacao);

    transacoesSalvas.push(transacao);

    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));
}); // método nativo de todo objeto

function addTransacaoAoDOM(transacao) {
    const operador = transacao.valor >= 0 ? '+' : '-'
    const classe = transacao.valor >= 0 ? 'positivo' : 'negativo'

    const li = document.createElement('li');
    li.innerHTML = `${transacao.descricao}<span>R$ ${transacao.valor}</span><button onClick="excluiTransacao(${transacao.id})"class="delete-btn">X</button>`
    li.id = "transacao-" + transacao.id
    li.classList.add(classe)

    transacoesUl.append(li)//não pode innerhtml
}
function somaReceitaDespesa(transacao, idBtn) {

    const elemento = idBtn == "btn-receita" ? receitaP : despesaP
    const substituir = idBtn == "btn-receita" ? "+ R$" : "- R$";
    let valorAtual = elemento.innerHTML.replace(substituir, "")

    valorAtual = parseFloat(valorAtual)
    valorAtual += Math.abs(transacao.valor)

    elemento.innerHTML = valorAtual
    elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`


}

function somaAoSaldo(transacao) {
    const valorTransacao = transacao.valor; 

    let total = balancoH1.innerHTML.replace('R$', ''); 
    total = parseFloat(total);
    total += valorTransacao;
    
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}

function desfazerTransacoes(transacao, idBtn) {
    let total = balancoH1.innerHTML.replace('R$', '');

    total = parseFloat(total);
    total -= transacao.valor;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;

    const elemento = idBtn == "btn-receita" ? receitaP : despesaP
    const substituir = idBtn == "btn-receita" ? "+ R$" : "- R$";
    let valorAtual = elemento.innerHTML.replace(substituir, "")

    valorAtual = parseFloat(valorAtual)
    valorAtual -= Math.abs(transacao.valor)

    elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`;
}


function carregarDados() {
    transacoesUl.innerHTML = ''//Limpa os uls
    balancoH1.innerHTML = 'R$0.00'
    receitaP.innerHTML = '+ R$0.00'
    despesaP.innerHTML = '- R$0.00'

    let operacao;
    for (let i = 0; i < transacoesSalvas.length; i++) {
        somaAoSaldo(transacoesSalvas[i]);

        operacao = transacoesSalvas[i].valor > 0 ? "btn-receita" : "btn-despesa";
        somaReceitaDespesa(transacoesSalvas[i], operacao);

        addTransacaoAoDOM(transacoesSalvas[i]);
    }
}

carregarDados();

function excluiTransacao(id){

    const transacaoIndex = transacoesSalvas.findIndex((transacao) => transacao.id == id); //percorre o vetor todo executando uma função

    const transacaoRemovida = transacoesSalvas[transacaoIndex];
    const operacao = transacaoRemovida.valor > 0 ? "btn-receita" : "btn-despesa";

    
    desfazerTransacoes(transacaoRemovida,operacao)


    const elementoDOM = document.getElementById("transacao-" + id);
    
    if (elementoDOM) {
            elementoDOM.remove();
        }

    transacoesSalvas.splice(transacaoIndex, 1); 
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));

}

function gerarProximoID(){

    if(transacoesSalvas.length == 0)
        return 1
    
    return  transacoesSalvas[transacoesSalvas.length - 1].id + 1
}