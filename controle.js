const form = document.getElementById("form"); //boa pratica declarar como const 
// document é um objeto de contexto sobre a pagina para acesso aos objetos
// todas as classes js tem seu respectivo objeto que são retornadas ao usar o getelments
// pegamos o form para o comprtamento do submit
const descInput = document.querySelector('#descricao'); // outra forma de pegar o imput
const valorInput = document.getElementById("montante");
const balancoH1 = document.getElementById('balanco');
const receitaP = document.getElementById('din-positivo');
const despesaP = document.getElementById('din-negativo');


form.addEventListener("submit", (e) => {
    e.preventDefault(); //sequestra o evento padrão de envio

    const descTransacao =  descInput.value;
    const valorTransacao =  valorInput.value;
    
    // Fail Fast: sempre que mexer com api externa, valide tudo logo no 
    // inicio do método, antes de qualquer coisa
    if ( descTransacao == "" || valorTransacao == ""){
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
}); // método nativo de todo objeto

function somaReceitaDespesa(transacao){

    const elemento = transacao.valor > 0 ? receitaP : despesaP
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";
    let valorAtual = elemento.innerHTML.replace(substituir, "")
    valorAtual = parseFloat(valorAtual)
    valorAtual += Math.abs(transacao.valor)
    elemento.innerHTML = valorAtual
    elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`
}

function somaAoSaldo(transacao){
    const valorTransacao = transacao.valor; // pegamos para não mudar o valor inicial
    
    let total = balancoH1.innerHTML.replace('+ R$','- R$'); //não é o input (é uma tag), por isso o innerhtml
    // .replace é um método da string que substitui
    total = parseFloat(total);
    total += valorTransacao;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}
