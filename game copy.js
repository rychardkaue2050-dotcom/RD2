let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];




function atualizarJogadorDoJogo() {

    const jogadorAtual = JSON.parse(localStorage.getItem("jogadorAtual"));

    if (jogadorAtual) {

        const index = jogadores.findIndex(function(jogador) {

            return jogador.id === jogadorAtual.id;

        });

        if (index !== -1) {

            jogadores[index].pontos = Math.max(
                jogadores[index].pontos || 0,
                jogadorAtual.pontos || 0
            );

            jogadores[index].nivel = jogadorAtual.nivel;

            salvarJogadores();

            localStorage.removeItem("jogadorAtual");

        }

    }

}

atualizarJogadorDoJogo();

mostrarJogadores();



function cadastrarJogador() {

    const nome = document.getElementById("nome").value;
    const nickname = document.getElementById("nickname").value;

    if (nome === "" || nickname === "") {

        alert("Preencha todos os campos!");

        return;
    }

    const jogador = {

        id: Date.now(),

        nome: nome,

        nickname: nickname,

        pontos: 0,

        nivel: 1

    };

    
    jogadores.push(jogador);

    
    salvarJogadores();

    
    document.getElementById("nome").value = "";
    document.getElementById("nickname").value = "";

   
    mostrarJogadores();

    alert("Jogador cadastrado com sucesso!");

}



function mostrarJogadores() {

    const lista = document.getElementById("listaJogadores");

    lista.innerHTML = "";

    if (jogadores.length === 0) {

        lista.innerHTML = "<p>Nenhum jogador cadastrado.</p>";

        return;
    }

    jogadores.forEach(function(jogador) {

        const div = document.createElement("div");

        div.className = "jogador";

        div.innerHTML = `

            <div class="informacoes">

                <strong>${jogador.nome}</strong>

                <span>Nickname: ${jogador.nickname}</span>

                <span>Pontos: ${jogador.pontos}</span>

                <span>Nível: ${jogador.nivel}</span>

            </div>

            <div class="botoes">

                <button 
                    class="btn-editar"
                    onclick="editarJogador(${jogador.id})">
                    Editar
                </button>

                <button 
                    class="btn-excluir"
                    onclick="excluirJogador(${jogador.id})">
                    Excluir
                </button>

                <button 
                    class="btn-jogar"
                    onclick="entrarNoJogo(${jogador.id})">
                    Jogar
                </button>

            </div>

        `;

        lista.appendChild(div);

    });

}




function editarJogador(id) {

    const jogador = jogadores.find(function(jogador) {

        return jogador.id === id;

    });

    if (!jogador) {

        return;

    }

    const novoNome = prompt(
        "Digite o novo nome:",
        jogador.nome
    );

    if (novoNome === null || novoNome === "") {

        return;

    }

    const novoNickname = prompt(
        "Digite o novo nickname:",
        jogador.nickname
    );

    if (novoNickname === null || novoNickname === "") {

        return;

    }

    jogador.nome = novoNome;

    jogador.nickname = novoNickname;

    salvarJogadores();

    mostrarJogadores();

}



function excluirJogador(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este jogador?"
    );

    if (!confirmar) {

        return;

    }

    jogadores = jogadores.filter(function(jogador) {

        return jogador.id !== id;

    });

    salvarJogadores();

    mostrarJogadores();

}



function salvarJogadores() {

    localStorage.setItem(
        "jogadores",
        JSON.stringify(jogadores)
    );

}



function entrarNoJogo(id) {

    const jogador = jogadores.find(function(jogador) {

        return jogador.id === id;

    });

    if (!jogador) {

        return;

    }

  
    localStorage.setItem(
        "jogadorAtual",
        JSON.stringify(jogador)
    );

   
    window.location.href = "index copy.html";

}