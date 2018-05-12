var express = require('express');
var router = express.Router();

const SparqlClient = require('sparql-client-2')
const SPARQL = SparqlClient.SPARQL
const endpoint = 'http://localhost:7200/repositories/mapa-grande'
const myupdateEndpoint = 'http://localhost:7200/repositories/mapa-grande/statements'

var client = new SparqlClient( endpoint, {updateEndpoint: myupdateEndpoint, 
                               defaultParameters: {format: 'json'}})

client.register({rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                 m: 'http://prc2018.di.uminho.pt/mapa#'})

/* GET home page. */
router.get('/', function(req, res, next) {
    var query = "select * where{\n" +
                "?d a m:Distrito .\n" +
                "?d m:nome ?nome } \n" +
                "order by ?nome"

    client.query(query)
            .execute()
            .then(function(qres){
                console.log(JSON.stringify(qres))
                var resList = qres.results.bindings
                var dot = "digraph Portugal {\n" +
                          'rankdir=LR;'
                          'PT [shape=box,label="Portugal"];\n' +
                          'distritos [shape=diamond,label="Distritos"];\n' +
                          'PT -> distritos [color=blue];\n'

                for(var i in resList){
                    var distrito = resList[i].d.value
                    var did = distrito.slice(distrito.indexOf('#')+1)
                    var dnome = resList[i].nome.value
                    var url = "http://localhost:3000/mapa/distrito/" + did

                    dot += 'd' + i + '[label="' + did + '",href="' + url + '"];\n'
                    dot += 'distritos -> d' + i + ' [color=blue];\n'
                    dot += 'nomeD' + i + ' [shape=box,label="' + dnome + '"];\n'
                    dot += 'd'+i+' -> nomeD'+i+' [label="nome"];\n'
                }
                    dot += "}"      
                res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })
})

router.get('/distrito/:did', (req, res, next)=>{
    var did = req.params.did
    var query = "select * where {\n" +
                "m:"+did+" m:nome ?nome .\n" +
                'OPTIONAL {\n' +
                'm:'+did+' m:temCidade ?c .\n' +
                '?c m:nome ?nomeC .\n' +
                '}\n' +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dnome = resList[0].nome.value
            var dot = "digraph Distrito {\n" +
                    'rankdir=LR;\n' +
                    'PT [label="Portugal",href="http://localhost:3000/mapa"];\n' +
                    'distritos [shape=diamond,label="Distritos"];\n' +
                    'PT -> distritos ;\n' +
                    'distritos -> \"' + dnome + '\";\n' +
                    '\"' + dnome + '\" -> cidades ;\n'
    
            for(var i in resList){
                var cidade = resList[i].c.value
                var cid = cidade.slice(cidade.indexOf('#')+1)
                var url = "http://localhost:3000/mapa/cidade/" + cid
                var cnome = resList[i].nomeC.value
    
                dot += 'c' + i + '[label="' + cid + '",href="' + url + '"];\n'
                dot += 'cidades -> c' + i + ';\n'
                dot += 'nomeC' + i + ' [shape=box,label="' + cnome + '"];\n'
                dot += 'c'+i+' -> nomeC'+i+' [label="nome"];\n'
            }
            dot += "}"      
            res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })    
})

router.get('/cidade/:id', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select * where{\n" +
                "m:" + cid + " m:nome ?nome .\n" +
                "m:" + cid + " m:pertenceDistrito ?d .\n" +
                "?d m:nome ?dnome }" 

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var cnome = resList[0].nome.value
            //var cdesc = resList[0].desc.value
            //var cpop = resList[0].pop.value
            var dnome = resList[0].dnome.value
            var distritoURI = resList[0].d.value
            var did = distritoURI.slice(distritoURI.indexOf('#')+1)

            var dot = "digraph Cidade {\n" +
                      'PT [label="Portugal",href="http://localhost:3000/mapa"];\n' +
                      'distritos [shape=diamond,label="Distritos"];\n' +
                      'cidades [shape=diamond,label="Cidades"];\n' +
                      '\"' + dnome + '\" [href="http://localhost:3000/mapa/distrito/' + did + '"];\n' +
                      'PT -> distritos ;\n' +
                      'distritos -> \"' + dnome + '";\n' +
                      '"'+ dnome + '" -> cidades ;\n'+
                      'cidades -> cidade ; \n' +
                      'cidade -> "' + cnome + '" [label="nome"];\n'
                      //'cidade -> "' + cdesc + '" [label="descrição"];\n'+
                      //'cidade -> "' + cpop + '" [label="população"];\n'

            dot += '}'
            console.log('\n\nMapa:\n' + dot)
            res.render("showMapa", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        }) 
 })

module.exports = router;