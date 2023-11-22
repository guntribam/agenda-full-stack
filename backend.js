const http = require('http')

let contatos = [
    { nome: "Paulo", idade: 35, telefone: 999999, email: "paulo@gmail.com" },
    { nome: "Ivone", idade: 28, telefone: 999999, email: "ivone@gmail.com" }
]

function obterContatos(req, res) {
    res.statusCode = 200
    res.end(JSON.stringify(contatos))
}

function adicionarContato(req, res) {
    console.log("oi")
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        let contato = JSON.parse(body)
        contatos.push(contato)
        res.statusCode = 200
        res.end(JSON.stringify(contato))
    })
}

function atualizarContato(req, res) {
    const nomeParaProcurar = req.url.split('/')[2]
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const index = contatos.findIndex(contato => contato.nome === nomeParaProcurar)
        if (index > -1) {
            contatos[index] = JSON.parse(body);
            res.statusCode = 200
            res.end(JSON.stringify(contatos[index]))
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
        }
    })
}

function apagarContato(req, res) {
    const nomeParaProcurar = req.url.split('/')[2]
    const index = contatos.findIndex(contato => contato.nome === nomeParaProcurar)
    if (index > -1) {
        contatos.splice(index, 1);
        res.statusCode = 200
        res.end(JSON.stringify({ mensagem: "apagado com sucesso" }))
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
    }
}

const servidorWEB = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204; // No Content
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json')

    if (req.url === '/api') {
        obterContatos(req, res)
    } else if (req.url === '/create' && req.method === 'POST') {
        adicionarContato(req, res)
    } else if (req.url.startsWith('/update/') && req.method === 'PUT') {
        atualizarContato(req, res)
    } else if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
        apagarContato(req,res)
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "rota não encontrada" }))
    }

})

servidorWEB.listen(5000, () => console.log("Servidor tá ON!"))