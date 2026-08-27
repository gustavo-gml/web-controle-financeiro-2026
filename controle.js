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
    const valorTransacao = valorInput.value;

    // Fail Fast: sempre que mexer com api externa, valide tudo logo no 
    // inicio do método, antes de qualquer coisa
    if (descTransacao == "" || valorTransacao == "") {
        alert('Descrição e valor não podem ser vazios.');
        return; // sempre mata o método
    }

    //limpa 
    descInput.value = "";
    valorInput.value = "";

    //objeto literal
    const transacao = {
        id: parseInt(Math.random() * 1000),
        descricao: descTransacao,
        valor: parseFloat(valorTransacao)
    }

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);
    addTransacaoAoDOM(transacao);

    transacoesSalvas.push(transacao);

    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));
}); // método nativo de todo objeto

function addTransacaoAoDOM(transacao) {
    const operador = transacao.valor >= 0 ? '+' : '-'
    const classe = transacao.valor >= 0 ? 'positivo' : 'negativo'

    const li = document.createElement('li');
    li.innerHTML = `${transacao.descricao}<span>R$ ${transacao.valor}</span><button class="delete-btn">X</button>`
    li.classList.add(classe)

    transacoesUl.append(li)//não pode innerhtml
}
function somaReceitaDespesa(transacao) {

    const elemento = transacao.valor > 0 ? receitaP : despesaP
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";
    let valorAtual = elemento.innerHTML.replace(substituir, "")
    valorAtual = parseFloat(valorAtual)
    valorAtual += Math.abs(transacao.valor)
    elemento.innerHTML = valorAtual
    elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`


}

function somaAoSaldo(transacao) {
    const valorTransacao = transacao.valor; // pegamos para não mudar o valor inicial

    let total = balancoH1.innerHTML.replace('+ R$', ''); //não é o input (é uma tag), por isso o innerhtml
    // .replace é um método da string que substitui
    console.log(total)
    total = parseFloat(total);
    total += valorTransacao;
    console.log(typeof(total))
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}


function carregarDados() {
    transacoesUl.innerHTML = ''//Limpa os uls
    balancoH1.innerHTML = 'R$0.00'
    receitaP.innerHTML = '+ R$0.00'
    despesaP.innerHTML = '- R$0.00'

    for (let i = 0; i < transacoesSalvas.length; i++) {
        somaAoSaldo(transacoesSalvas[i]);
        somaReceitaDespesa(transacoesSalvas[i]);
        addTransacaoAoDOM(transacoesSalvas[i]);
    }
}

carregarDados();