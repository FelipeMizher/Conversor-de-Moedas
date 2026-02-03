async function converterMoedas(){
    const rawValor = document.getElementById('valor').value;
    const valor = parseFloat(rawValor);
    const moedaSelecionada = document.getElementById('OpcaoMoeda').value;

    // Validação do valor inserido
    if(!rawValor || isNaN(valor)){
        alert("Digite um valor válido!");
        return;
    }

    try{
        // Busca das taxas de câmbio na API Frankfurter
        const url = "https://api.frankfurter.app/latest?from=BRL&to=USD,EUR";
        const resp = await fetch(url);

        // Verificação de erros na resposta da API
        if(!resp.ok){ 
            throw new Error("Erro na resposta da API");
        }
        
        const dados = await resp.json();
        const brlToUsd = dados.rates.USD;
        const brlToEur = dados.rates.EUR;

        // Funções para formatar os valores nos tipos de moedas
        const formatBRL = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formatUSD = v => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const formatEUR = v => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

        let valorEmReal, valorEmDolar, valorEmEuro;

        // Conversão baseada na moeda selecionada
        if(moedaSelecionada === "real"){
            valorEmReal = valor;
            valorEmDolar = valor * brlToUsd;
            valorEmEuro = valor * brlToEur;

        } else if(moedaSelecionada === "dolar"){
            valorEmDolar = valor;
            valorEmReal = valor / brlToUsd;
            valorEmEuro = valorEmReal * brlToEur;

        } else if(moedaSelecionada === "euro"){
            valorEmEuro = valor;
            valorEmReal = valor / brlToEur;
            valorEmDolar = valorEmReal * brlToUsd;
        }

        // Exibição dos resultados formatados
        document.getElementById('real').innerText =
            `🇧🇷 Reais -----> ${formatBRL(Number(valorEmReal.toFixed(2)))}`;

        document.getElementById('dolar').innerText =
            `💵 Dólares ---> ${formatUSD(Number(valorEmDolar.toFixed(2)))}`;

        document.getElementById('euro').innerText =
            `💶 Euros -----> ${formatEUR(Number(valorEmEuro.toFixed(2)))}`;

    }catch(erro){
        console.error(erro);
        alert("Erro ao buscar dados da API de moedas.");
    }
}
