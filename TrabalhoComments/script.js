const smellyCode = `
// Função responsável por calcular o total final do carrinho
function calcTotal(carrinho, tx, cupom) {
    // 1. Inicializa o valor total
    let t = 0; 
    
    // 2. Itera sobre os itens do carrinho e soma os preços
    for (const item of carrinho) {
        t += item.preco * item.qtd;
    }

    // 3. Aplica a taxa (imposto)
    t = t * (1 + tx);
    
    // if (carrinho.length > 5) {
    //    // Implementação antiga de desconto por volume
    //    t = t - 20; 
    // }

    // 4. Se houver cupom, aplica o desconto
    if (cupom && cupom.tipo === 'FIXO') {
        // Desconta o valor fixo do cupom
        t -= cupom.valor;
    } 

    // Retorna o total para o checkout
    return t;
}
`;

const cleanCode = `
// Código Auxiliar: Constantes e Funções Focadas

const TAXA_PADRAO = 0.05; // Comentário bom: explica uma constante arbitrária

function calcularValorTotal(itens, cupomDesconto) {
    // 1. O nome da função já explica o que ela faz. Não precisa de comentário.
    const subtotal = calcularSubtotal(itens);
    
    const totalComImposto = aplicarTaxa(subtotal, TAXA_PADRAO);
    
    const totalFinal = aplicarCupom(totalComImposto, cupomDesconto);

    return totalFinal;
}

function calcularSubtotal(itens) {
    // Nomes de variáveis claros (item.quantidade) eliminam a necessidade de comentar o loop
    return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function aplicarTaxa(valor, taxa) {
    return valor * (1 + taxa);
}

function aplicarCupom(valor, cupom) {
    if (cupom && cupom.tipo === 'FIXO') {
        return valor - cupom.valor;
    } 
    return valor;
}
// Código antigo foi removido, pois o sistema de controle de versão (Git) já cuida disso.
`;

const quizData = [
    {
        question: "Qual o principal problema dos comentários que explicam o 'O quê' o código faz?",
        options: [
            "Eles aumentam a segurança do código.",
            "Eles tendem a se tornar obsoletos e mentirosos com o tempo.",
            "Eles são necessários para a performance do JavaScript.",
            "Eles ajudam na documentação automática."
        ],
        answer: "Eles tendem a se tornar obsoletos e mentirosos com o tempo.",
    },
    {
        question: "De acordo com o Clean Code, se um bloco de código precisa de um comentário para ser entendido, o que você deve fazer primeiro?",
        options: [
            "Deixar o comentário e ignorar o problema.",
            "Refatorar o código, usando bons nomes para torná-lo autoexplicativo.",
            "Usar uma IDE mais avançada.",
            "Mover o código para outro arquivo."
        ],
        answer: "Refatorar o código, usando bons nomes para torná-lo autoexplicativo.",
    },
    {
        question: "Qual tipo de comentário é geralmente considerado aceitável ou até necessário?",
        options: [
            "Comentários de código morto (código comentado, mas não excluído).",
            "Comentários que explicam a lei ou o motivo de uma regra de negócio complexa.",
            "Comentários de 'fechamento de chave' (// fim do if).",
            "Comentários que apenas repetem o nome da variável."
        ],
        answer: "Comentários que explicam a lei ou o motivo de uma regra de negócio complexa.",
    },

     {
        question: "O que é um 'TODO' ou 'FIXME' deixado no código, em relação ao Code Smell Comentários?",
        options: [
            "É um comentário ruim e deve ser excluído imediatamente.",
            "É um sinal de que o código está finalizado e pronto para produção.",
            "É um comentário temporário que serve como lembrete para trabalho futuro.", 
            "É uma forma de documentação legal exigida por lei."
        ],
        answer: "É um comentário temporário que serve como lembrete para trabalho futuro.",
    }
];

function loadCodeExamples() {
    document.getElementById('smelly-code-content').textContent = smellyCode.trim();
    document.getElementById('clean-code-content').textContent = cleanCode.trim();
}

function loadQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; 

    quizData.forEach((data, index) => {
        const questionBox = document.createElement('div');
        questionBox.classList.add('question-box');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Questão ${index + 1}: ${data.question}`;
        questionBox.appendChild(questionTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');
        
        const shuffledOptions = shuffleArray([...data.options]);

        shuffledOptions.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${index}`;
            input.value = option;

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
        });

        questionBox.appendChild(optionsDiv);
        quizContainer.appendChild(questionBox);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Verificar Respostas';
    submitButton.onclick = checkQuiz;
    quizContainer.appendChild(submitButton);

    const resultDiv = document.createElement('div');
    resultDiv.id = 'result';
    quizContainer.appendChild(resultDiv);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkQuiz() {
    let score = 0;
    const totalQuestions = quizData.length;
    const resultDiv = document.getElementById('result');

    quizData.forEach((data, index) => {
        const selector = `input[name="question-${index}"]:checked`;
        const selectedInput = document.querySelector(selector);
        
        document.querySelectorAll(`input[name="question-${index}"]`).forEach(input => {
            input.parentElement.classList.remove('correct', 'incorrect');
        });

        if (selectedInput) {
            const selectedAnswer = selectedInput.value;
            const isCorrect = selectedAnswer === data.answer;

            selectedInput.parentElement.classList.add(isCorrect ? 'correct' : 'incorrect');

            if (!isCorrect) {
                const correctLabel = document.querySelector(`input[name="question-${index}"][value="${data.answer}"]`).parentElement;
                correctLabel.classList.add('correct');
            }

            if (isCorrect) {
                score++;
            }
        }
    });

    resultDiv.textContent = `Você acertou ${score} de ${totalQuestions} questões!`;
    resultDiv.style.color = score === totalQuestions ? '#2ecc71' : (score > 0 ? '#ff9800' : '#e74c3c');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCodeExamples();
    loadQuiz();
});