const uploadBtn = document.getElementById("upload-btn")
const inputUpload = document.getElementById("imagem-upload")

// aqui, estamos usando um escutador de eventos para fazer com que o 
// clique no botão de upload execute um clique no input em que será armazenada 
// a imagem:
uploadBtn.addEventListener("click", () => {

    //por mais doido que pareça, só de clicar no input do tipo "file"
    //o site já abre uma janela do windows pra buscar arquivos no PC:
    inputUpload.click()
})

function lerConteudoDoArquivo(arquivo) {

    return new Promise((resolve, reject) => {

        // aqui, estamos criando um novo objeto do tipo FileReader:
        const leitor = new FileReader();

        //a PROPRIEDADE onload é usada para chamar UMA função quando a leitura do arquivo é concluída:
        leitor.onload = () => {

            //se o carregamento do arquivo for concluído, vamos chamar o resolve da promise
            //o resolve retorna um objeto sem nome em si, mas que tem as propriedades "url" e "nome"
            //a propriedade "result" da variável "leitor" contém a URL base 64 retornada pelo 
            // método "readAsDataURL" chamado abaixo:
            resolve({ url: leitor.result, nome: arquivo.name })
        }

        //se houver algum erro na leitura do arquivo, o método onerror é acionado:
        leitor.onerror = () => {

            //se o carregamento do arquivo resultar em erro, vamos chamar o reject da promise:
            reject(`Erro na leitura do arquivo ${arquivo.name}.`)
        }

        // aqui estamos lendo o arquivo e pegando sua URL como base 64:
        leitor.readAsDataURL(arquivo)

    })

}

//criando uma variável para armazenar a imagem principal:
const imagemPrincipal = document.querySelector(".main-imagem")
//criando uma variável para armazenar o parágrafo que tem papel
//de nome da imagem principal:
const nomeImagemPrincipal = document.querySelector(".container-imagem-nome p")

//mesmo o input da imagem estando oculto, estamos atribuindo um escutador
//com change para chamar a função assíncrona que vai chamar nossa função
//"lerConteudoDoArquivo" (lembrando que essa função contém uma promise)
inputUpload.addEventListener("change", async (evento) => {

    //seleciona o arquivo (que é o target do change da caixa de input)
    //e joga em sua variável:
    const arquivo = evento.target.files[0]

    //se a linha anterior tiver funcionado, vai pegar o resolve
    //da promise por intermédio da função "lerConteudoDoArquivo"
    //e, dessa forma, captar pelo objeto do resolve tanto a URL quanto
    //o nome do arquivo selecionado pelo usuário:
    if (arquivo) {

        try {

            //é essa variável que recebe o objeto contido no resolve da promise:
            const conteudoArquivo = await lerConteudoDoArquivo(arquivo)

            //a src da imagem principal recebe a propriedade "url" do objeto recebido por intermédio do resolve da promise
            imagemPrincipal.src = conteudoArquivo.url

            //o conteúdo do parágrafo que tem papel de nome da imagem recebe a
            //propriedade "nome" do objeto recebido por intermédio do resolve
            //da promise:
            nomeImagemPrincipal.textContent = conteudoArquivo.nome

        } catch (erro) {

            console.error("Erro na leitura do arquivo.")
        }
    }

})

//esse trecho de código é para inserir as tags pressionando Enter:

//joga o input das tags em sua variável:
const inputTags = document.getElementById("categoria")
//joga a lista de tags ("ul") em sua variável:
const listaTags = document.getElementById("lista-tags")

//vamos usar um escutador de eventos com o evento de clique para remover as tags quando desejado:
listaTags.addEventListener("click", (evento) => {

    //se o alvo do evento de clique contiver a classe "remove-tag" (que colocamos na imagem de "x" dentro da tag)
    //, a tag em si (elemento "li") será removida
    if (evento.target.classList.contains("remove-tag")) {

        //aqui, estamos jogando O PAI da imagem de "x" (o pai do "x" é o elemento "li" utilizado como tag) em sua variável:
        const tagParaRemover = evento.target.parentElement

        //por fim, estamos pegando a lista de tags (que é um elemento "ul") e removendo seu filho através da variável em que o elemento "li" tinha sido armazenado (comando acima)
        listaTags.removeChild(tagParaRemover)

    }
})

//aqui, estamos definindo um vetor com nossas tags aceitas:
const tagsDisponiveis = ["Front-end", "Programação", "Desenvolvimento web", "HTML", "CSS", "JavaScript"]

//segundo a professora, vamos simular uma busca em banco de dados. Por isso o uso de uma
//função assíncrona com "setTimeOut":
async function verificaTagsDisponiveis(tagTexto) {

    //nossa função assíncrona vai retornar essa promessa.
    // A promessa terá apenas o resolve, não terá o reject
    return new Promise((resolve) => {

        //utilizando um atraso de 0,1 segundo:
        setTimeout(() => {

            //após 0,1 segundo, o resolve retornar True se nosso vetor de 
            //tags disponíveis inclui o texto digitado no input, usando o 
            // método "includes":
            resolve(tagsDisponiveis.includes(tagTexto))
        }, 100);
    })
}

//usaremos o escutador de eventos com o evento de keypress
//para criar dinamicamente um novo elemento na lista de tags
//foi adicionado um identificador de função assíncrona na função de callback
//do evento:
inputTags.addEventListener("keypress", async (evento) => {

    //executa a inserção da tag quando se pressiona Enter na
    //caixa de input das tags:
    if (evento.key === "Enter") {

        //previne a página de atualizar (comportamento padrão) e apagar os dados quando se aperta
        //o Enter:
        evento.preventDefault()

        //faz um trim no texto colocado no input das tags e joga em sua variável:
        const tagTexto = inputTags.value.trim()

        //tenta executar a inserção apenas se o campo não estiver vazio após o trim:
        if (tagTexto !== "") {

            try {
                //joga o retorno booleano da função "verificaTagDisponiveis" em sua variável
                //devemos usar o await porque a função é assíncrona:
                const tagExiste = await verificaTagsDisponiveis(tagTexto)

                //executa finalmente a inserção apenas se a tag estiver disponível
                //testando o retorno booleano da função "verificaTagDisponivel":
                if (tagExiste) {
                    //cria um novo elemento "li" e joga em sua variável:
                    const novaTag = document.createElement("li")

                    //no innerHTML do novo elemento de lista, joga o valor pego (depois do trim) e também a imagem do "x"
                    //ao lado, que vai ser usada para retirar a tag:
                    novaTag.innerHTML = `<p>${tagTexto}</p> <img src = "./img/close-black.svg" class = "remove-tag">`

                    //faz com que nosso elemento de lista criado seja filho da nossa lista:
                    listaTags.appendChild(novaTag)

                    //por fim, limpa o campo de input das tags para que possa ser
                    //novamente utilizado:
                    inputTags.value = ""
                } else {
                    alert("Essa tag não é válida! Repita a inserção.")
                    inputTags.value = ""
                }
            } catch (error) {
                console.error("Tag inválida!")
                alert("Erro ao verificar a existência da tag.")
            }
        }
    }
})

//jogando os botões de publicar e descartar em suas respectivas variáveis:
const publicarBtn = document.querySelector(".botao-publicar")
const descartarBtn = document.querySelector(".botao-descartar")

//essa função assíncrona vai se utilizar de uma promise para retornar um resolve
//caso o número gerado com o método "random" do objeto "Math" seja maior que 0,5
//e vai retornar um reject caso o número gerado seja menor ou igual 0,5, tudo
//isso após 2 segundos. Essa função será chamada dentro do evento de clique
//do botão publicar:
async function publicarProjeto (nomeProjeto, descricaoProjeto, tagsProjeto) {

    return new Promise ((resolve, reject) => {
        setTimeout(() => {

            const deuCerto = Math.random()> 0.5

            if (deuCerto) {

                resolve("Projeto publicado com sucesso.")
            } else{

                reject("Erro ao publicar o projeto.")
            }
        }, 2000)
    })
}

//aqui, vamos usar o evento de clique no botão publicar
//para captar os dados do formulário:
publicarBtn.addEventListener("click", async (evento) => {

    evento.preventDefault()

    //pega o valor do input com o nome do projeto e joga em sua variável:
    const nomeProjeto = document.getElementById("nome").value
    //pega o valor do input com a descrição do projeto e joga em sua variável:
    const descricaoProjeto = document.getElementById("descricao").value

    //aqui rolaram algumas coisas, rsrsrsrsrs
    //estamos selecionando todos os elementos "p" dentro da variável "listaTags" (que armazena nossa lista "ul").
     //aí, com esses elementos "p", estamos criando um vetor
    //finalmente, para esse vetor, estamos usando o método "map" para converter os elementos "p" em seus conteúdos de texto.
    const tagsProjeto = Array.from(listaTags.querySelectorAll("p")).map((tag) => tag.textContent)

    //aqui estamos tratando o resultado da promise que tem dentro da função "publicarProjeto"
    //com um try-catch. Se a função "publicarProjeto" der certo e retornar o resolve, aparece a mensagem
    //colocada no resolve no console, e um alert com o feedback "Deu tudo certo!"
    try{

        const resultado = await publicarProjeto (nomeProjeto, descricaoProjeto, tagsProjeto)

        console.log(resultado)
        alert("Deu tudo certo!")

    //aqui, caso a função "publicarProjeto" não dê certo e retorne o reject, vai cair no catch.
    //No console será exibida a mensagem "Deu errado: Erro ao publicar o projeto", já que 
    //"Erro ao publicar o projeto era o retorno do reject:
    } catch (error) {

        console.log ("Deu errado: ", error)
        alert("Deu tudo errado! Oh não...")
    }
})

//aqui, usaremos o escutador de eventos com clique para limpar tudo que
//foi subido na página e colocado nos campos de formulário:
descartarBtn.addEventListener("click", (evento) => {

    evento.preventDefault()

    //aqui estamos selecionando o primeiro formulário do HTML (no caso, o único)
    //e jogando em sua variável
    const formulario = document.querySelector("form")

    //o método reset já apaga tudo dentro do formulário:
    formulario.reset()

    //fazendo a imagem principal voltar a ser aquela imagem padrão que fica
    //no site:
    imagemPrincipal.src = "./img/imagem1.png"
    //fazendo o nome da imagem voltar a ser aquele nome padrão:
    nomeImagemPrincipal = "image_projeto.png"

    //esvaziando o conteúdo interno da nossa lista "ul" que contem as tags 
    //que haviam sido inseridas dinamicamente:
    listaTags.innerHTML = ""

})