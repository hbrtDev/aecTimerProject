/* Variaveis globais */
let attentionData_arr = []
let haveListeners = 0
let faseAtual = 'Linha de Base - Minuto 1'
let participante = 'Placeholder participante'
let avaliadorElm = ''
let avaliadorValue = ''
let avaliadorName = 'Placeholder avaliador'
/* Globais de atenção */
let attentionB1_times = 0
let attentionC1_times = 0
let b1_startTime = 0
let c1_startTime = 0
let b1_stopTime = 0
let c1_stopTime = 0
let attentionB1_dataToObj = []
let attentionC1_dataToObj = []

/* Obj de atenção */
class attentionData_obj {
    constructor(atencaoB1, atencaoC1) {
        this.atencaoB1 = atencaoB1;
        this.atencaoC1 = atencaoC1;
    }
}

/* Lugares */
const telaInicial = document.querySelector('.cadastro--main')
const telaTestagem = document.querySelector('.testagem--main')
const header = document.querySelector('header')
const cronometro = document.querySelector('.cronometro')

/* Listener do botão de ir para tela de testagem */
document.querySelector('.toTest_btn').addEventListener('click', (e) => {
    e.preventDefault()

    reloadNamesData()

    if (avaliadorValue === '0') {
        window.alert('Por favor, insira um nome de avaliador válido!')
    } else {
        /* Carrega a Tela de testagem */
        telaTestagem.classList.remove('hidden')
        telaTestagem.classList.add('container')
        header.classList.remove('hidden')
        document.querySelector('footer').classList.remove('hidden')

        /* Configura elementos do Header */
        headerConfiguration(participante, avaliadorName)

        /* Remove a tela de cadastro */
        telaInicial.classList.add('hidden')
    }
})

/* Atualiza o campos com os nomes importantes para o nomes corretos */
function reloadNamesData() {
    participante = document.querySelector('input.participante--input').value.trim()
    avaliadorElm = document.querySelector('select.avaliador--select')
    avaliadorValue = avaliadorElm.value
    avaliadorName = avaliadorElm.children[avaliadorElm.selectedIndex].textContent.trim()
}

/* Função que atualiza o header com informações do cadastro */
function headerConfiguration(participante, avaliador) {
    document.querySelector('div.avaliador--header').textContent = `Olá, ${avaliador}!`
    document.querySelector('div.participante--header').textContent = `Participante atual: ${participante}`
}

/* Listener do inicio da cronometragem */
document.querySelector('.startClock_btn').addEventListener('click', (e) => {
    e.preventDefault()
    e.target.classList.add('hidden');

    startTimer(8, 0, 0)
})

/* Cronometra o tempo de avaliação */
function startTimer(minutes, seconds, milliseconds) {
    const totalDuration = (minutes * 60 + seconds) * 1000 + milliseconds;
    let startTime = Date.now();
    let endTime = startTime + totalDuration;
    const cronometro = document.querySelector('.cronometro');
    const fase = document.querySelector('.timer p');

    handleAttention();

    const updateTimer = () => {
        const now = Date.now();
        let remainingTime = endTime - now;

        if (remainingTime <= 0) {
            remainingTime = 0;
            clearInterval(interval);
            fase.textContent = "Fase atual: Fim da contagem";
            lastAttentionData();
            document.querySelector('.result').classList.remove('hidden');
        }

        const totalSeconds = Math.floor(remainingTime / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        const millisec = remainingTime % 1000;

        cronometro.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}:<span>${millisec < 100 ? (millisec < 10 ? '00' : '0') : ''}${millisec}</span>`;

        // Atualizar a fase conforme o tempo
        if (min === 7 && sec === 0) {
            fase.textContent = "Fase atual: Linha de Base - Minuto 2";
            faseAtual = 'Linha de Base - Minuto 2';

        } else if (min === 6 && sec === 0) {
            fase.textContent = "Fase atual: Consequência Social de B-1 - Minuto 1";
            faseAtual = 'Consequência Social de B-1 - Minuto 1';

        } else if (min === 5 && sec === 0) {
            fase.textContent = "Fase atual: Consequência Social de B-1 - Minuto 2";
            faseAtual = 'Consequência Social de B-1 - Minuto 2';

        } else if (min === 4 && sec === 0) {
            fase.textContent = "Fase atual: Consequência Social de C-1 - Minuto 1";
            faseAtual = 'Consequência Social de C-1 - Minuto 1';

        } else if (min === 3 && sec === 0) {
            fase.textContent = "Fase atual: Consequência Social de C-1 - Minuto 2";
            faseAtual = 'Consequência Social de C-1 - Minuto 2';

        } else if (min === 2 && sec === 0) {
            fase.textContent = "Fase atual: Consequência Social de B-2 - Minuto 1";
            faseAtual = 'Consequência Social de B-2 - Minuto 1';

        } else if (min === 1 && sec === 0) {
            fase.textContent = "Fase atual: Extinção Operante - Minuto 1";
            faseAtual = 'Extinção Operante - Minuto 1';

        }
    }

    const interval = setInterval(updateTimer, 10); // Atualiza a cada 10 milissegundos
}

/* Ouve os cliques nos botões e atualiza dados a partir disso */
function handleAttention() {
    /* Obj de inicialização */
    new attentionData_obj('inicialização', [0, 0], [0, 0])
    attentionData_arr.push(attentionData_obj)

    function handleButtonClick(e) {
        e.preventDefault();

        /* Caso seja b1 */
        if (e.target.classList.contains('dir--esquerda') === true && e.target.classList.contains('focus') === false) {
            e.target.classList.toggle('focus');

            if (attentionData_arr[0].atencaoB1) {
                if (attentionData_arr[0].atencaoB1.at(-1)[0] === faseAtual) {
                    attentionB1_times++;
                } else {
                    attentionB1_times = 1
                    attentionC1_times = 1
                }
            } else {
                attentionB1_times++;
            }

            b1_startTime = new Date().getTime();

            if (document.querySelector('.dir--direita').classList.contains('focus')) {
                c1_stopTime = new Date().getTime();
                document.querySelector('.dir--direita').classList.remove('focus');
                attentionC1_dataToObj.push([faseAtual, attentionC1_times, c1_stopTime - c1_startTime]);
                attentionData_obj.atencaoC1 = attentionC1_dataToObj;

                attentionData_arr.pop();
                attentionData_arr.push(attentionData_obj);
            }
        }
        /* Caso seja c1 */
        else if (e.target.classList.contains('dir--direita') === true && e.target.classList.contains('focus') === false) {
            e.target.classList.toggle('focus');

            if (attentionData_arr[0].atencaoC1) {
                if (attentionData_arr[0].atencaoC1.at(-1)[0] === faseAtual) {
                    attentionC1_times++;
                } else {
                    attentionB1_times = 1
                    attentionC1_times = 1
                }
            } else {
                attentionC1_times++;
            }

            c1_startTime = new Date().getTime();

            if (document.querySelector('.dir--esquerda').classList.contains('focus')) {
                b1_stopTime = new Date().getTime();
                document.querySelector('.dir--esquerda').classList.remove('focus');
                attentionB1_dataToObj.push([faseAtual, attentionB1_times, b1_stopTime - b1_startTime]);
                attentionData_obj.atencaoB1 = attentionB1_dataToObj;

                attentionData_arr.pop();
                attentionData_arr.push(attentionData_obj);

            }
        } else {
            if (e.target.classList.contains('dir--esquerda') === true) {
                e.target.classList.toggle('focus');

                b1_stopTime = new Date().getTime();
                document.querySelector('.dir--esquerda').classList.remove('focus');
                attentionB1_dataToObj.push([faseAtual, attentionB1_times, b1_stopTime - b1_startTime]);
                attentionData_obj.atencaoB1 = attentionB1_dataToObj;

                attentionData_arr.pop();
                attentionData_arr.push(attentionData_obj);
            }
            else if (e.target.classList.contains('dir--direita') === true) {
                e.target.classList.toggle('focus');

                c1_stopTime = new Date().getTime();
                document.querySelector('.dir--direita').classList.remove('focus');
                attentionC1_dataToObj.push([faseAtual, attentionC1_times, c1_stopTime - c1_startTime]);
                attentionData_obj.atencaoC1 = attentionC1_dataToObj;

                attentionData_arr.pop();
                attentionData_arr.push(attentionData_obj);
            }
        }
    }

    document.querySelectorAll('.direcao').forEach(btn => {
        btn.addEventListener('click', handleButtonClick)
    })
}

function lastAttentionData() {
    let btnEsq = document.querySelector('.dir--esquerda')
    let btnDir = document.querySelector('.dir--direita')


    if (btnEsq.classList.contains('focus') === true) {
        btnEsq.classList.toggle('focus');

        b1_stopTime = new Date().getTime();
        btnEsq.classList.remove('focus');

        attentionData_arr[0].atencaoB1.push([faseAtual, attentionB1_times, b1_stopTime - b1_startTime]);
        console.log('final esq')
    }
    else if (btnDir.classList.contains('focus') === true) {
        btnDir.classList.toggle('focus');

        c1_stopTime = new Date().getTime();
        btnDir.classList.remove('focus');

        attentionData_arr[0].atencaoC1.push([faseAtual, attentionC1_times, c1_stopTime - c1_startTime]);
        console.log('final dir')
    }
}

/* Mostra os resultados na tela de resultados */
function showResults() {
    /* Tirando o Header */
    header.classList.add('hidden')

    /* Trazendo a tela de resultados à vista */
    document.querySelector('.resultado--main').classList.add('container')
    document.querySelector('.resultado--main').classList.remove('hidden')
    telaTestagem.classList.remove('container')
    telaTestagem.classList.add('hidden')

    /* Pega os nomes dos avaliadores e participantes */
    document.querySelector('.dadosGerais > .participante--span > b').textContent = participante
    document.querySelector('.dadosGerais > .avaliador--span > b').textContent = avaliadorName

    /* Separando as infos do array de infos que pode ser uma variavel futuramente */
    let b1Data = attentionData_arr[0].atencaoB1
    let c1Data = attentionData_arr[0].atencaoC1

    b1Data.map((entry) => {
        document.querySelectorAll('.fieldset--esq > legend').forEach(legend => {
            let textoB1 = `${entry[0].trim()} - B-1`

            if (legend.textContent.trim() === textoB1 && entry[1] > 0) {

                /* Colocando os valor total de atenção */
                legend.parentElement.querySelector('.totalAttention_b1 > b').textContent = entry[1]

                /* Achando e fazendo a tabela */
                let table = legend.parentElement.querySelector('table')
                makeTable(entry[1], entry[2], table)
            }
        })
    })

    c1Data.map((entry) => {
        document.querySelectorAll('.fieldset--dir > legend').forEach(legend => {
            let textoC1 = `${entry[0].trim()} - C-1`

            if (legend.textContent.trim() === textoC1 && entry[1] > 0) {

                /* Colocando os valor total de atenção */
                legend.parentElement.querySelector('.totalAttention_c1 > b').textContent = entry[1]

                /* Achando e fazendo a tabela */
                let table = legend.parentElement.querySelector('table')
                makeTable(entry[1], entry[2], table)
            }
        })
    })

    calculateAttention()
    caculateTotal()
    calculateRelevant()
}

/* Faz a tabela com os resultados */
function makeTable(id, milliseconds, table) {
    let trElement = document.createElement('tr')

    for (let i = 0; i < 3; i++) {
        let tdElement = document.createElement('td')

        if (i === 0) {
            tdElement.textContent = id
        } else if (i === 1) {
            const seconds = (milliseconds / 1000).toFixed(1);
            tdElement.textContent = `${seconds} segundos`;
            tdElement.classList.add('celula--tempo')
            if (seconds > 2) {
                tdElement.classList.add('significante');
            }
        }
        else {
            tdElement.textContent = milliseconds
        }

        trElement.appendChild(tdElement)
    }

    table.appendChild(trElement)
}

/* Filtro para todos os resultados */
function allResults() {
    document.querySelectorAll('tr').forEach(trElm => {
        if (trElm.classList.contains('hidden')) {
            trElm.classList.remove('hidden')
        }
    })
}

/* Filtro para apenas resultados relevantes */
function onlyRelevant() {
    document.querySelectorAll('tr').forEach(trElm => {
        if (trElm.children[1].classList.contains('significante') === false) {
            if (trElm.children[1].tagName.toLowerCase() === 'td') {
                trElm.classList.add('hidden')
            }
        }
    })
}

/* Calcula o total de atenção dada por etapa */
function calculateAttention() {
    let totalTime = 0

    document.querySelectorAll('.tempo--total').forEach(timeElm => {
        timeElm.parentElement.querySelectorAll('.celula--tempo').forEach(timeCel => {
            totalTime += parseFloat(timeCel.textContent.split('segundos')[0].trim())

            timeElm.querySelector('b').textContent = `${totalTime.toFixed(1)} segundos`
        })

        totalTime = 0
    })

    /* Logo após descobrir o total de atenção, calculamos o total de não-atenção */
    calculateDodge()
}

/* Calcula o total de atenção não dada (esquiva) por etapa */
function calculateDodge() {
    document.querySelectorAll('.esquiva--total').forEach(dodgeElm => {
        let attValue = parseFloat(dodgeElm.parentElement.querySelector('.tempo--total > b').textContent.split('segundos')[0].trim())
        dodgeElm.querySelector('b').textContent = `${(60 - attValue).toFixed(1)} segundos`
    })
}

/* Calcula o total de B1 e C1 */
function caculateTotal() {
    let totalB1 = 0
    let totalC1 = 0

    document.querySelectorAll('.totalAttention_b1 > b').forEach(b1Total => {
        totalB1 += parseInt(b1Total.textContent)
    })

    document.querySelectorAll('.totalAttention_c1 > b').forEach(c1Total => {
        totalC1 += parseInt(c1Total.textContent)
    })

    document.querySelector('.totalB1 > span').textContent = `/${totalB1}`
    document.querySelector('.totalC1 > span').textContent = `/${totalC1}`
}

/* Calcula o total relevante de B1 e C1 */
function calculateRelevant() {
    let totalB1 = 0
    let totalC1 = 0

    document.querySelectorAll('fieldset').forEach(fieldset => {
        if (fieldset.querySelector('.significante--total') !== null) {
            fieldset.querySelector('.significante--total > b').textContent = fieldset.querySelectorAll('.significante').length
        }
    })

    document.querySelectorAll('.fieldset--esq > .significante--total > b').forEach(b1Total => {
        totalB1 += parseInt(b1Total.textContent)
    })

    document.querySelectorAll('.fieldset--dir > .significante--total > b').forEach(c1Total => {
        totalC1 += parseInt(c1Total.textContent)
    })

    document.querySelector('.totalB1 > b').textContent = `${totalB1}`
    document.querySelector('.totalC1 > b').textContent = `${totalC1}`
}
