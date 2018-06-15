var express = require('express');
var router = express.Router();

const SparqlClient = require('sparql-client-2')
const SPARQL = SparqlClient.SPARQL
const endpoint = 'http://localhost:7200/repositories/OACC'
const myupdateEndpoint = 'http://localhost:7200/repositories/OACC/statements'

var client = new SparqlClient( endpoint, {updateEndpoint: myupdateEndpoint, 
                               defaultParameters: {format: 'json'}})

client.register({rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', oacc: 'http://www.semanticweb.org/octavio/ontologies/2018/5/oacc#'})

/* GET home page. */
router.get('/', function(req, res, next) {
    var query = "select ?coin where{\n" +
                    "?s a oacc:Cryptocurrency.\n" +
                    "?s oacc:tag ?coin.\n"+
                "}"

    client.query(query)
            .execute()
            .then(function(qres){
                //console.log(JSON.stringify(qres))
                var resList = qres.results.bindings
                //console.log(resList)
                var dot = "digraph Cryptocurrencies {\n" +
                          'rankdir=LR;'

                for(var i in resList){
                    var coin_name = resList[i].coin.value
                    var did = coin_name.slice(coin_name.indexOf('#')+1)
                    var url = "http://localhost:3000/map/coin/" + did

                    dot += 'd' + i + '[style=filled,color="dodgerblue",label="' + did + '",href="' + url + '"];\n'
                    dot += 'Cryptocurrency -> d' + i + ' [color=black];\n'
                }
                    dot += "}"      
                res.render("showMap", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })
})

router.get('/coin/:did', (req, res, next)=>{
    var did = req.params.did
    //console.log(did)
    var query = "select * where {\n" +
                    "?s a oacc:Cryptocurrency.\n" +
                    "?s oacc:tag ?name.\n" +
                    "OPTIONAL{?s oacc:isPOS ?pos.}\n"+
                    "OPTIONAL{?s oacc:isPOW ?pow.}\n"+
                    "OPTIONAL{?s oacc:about ?about.}\n"+
                    "OPTIONAL{?s oacc:blockreward ?breward.}\n"+
                    "OPTIONAL{?s oacc:blocktime ?btime.}\n"+
                    "OPTIONAL{?s oacc:circulatingsupply ?csupply.}\n"+
                    "OPTIONAL{?s oacc:founded ?founded.}\n"+
                    "OPTIONAL{?s oacc:icoammount ?icoammount.}\n"+
                    "OPTIONAL{?s oacc:maxsupply ?maxsupply.}\n"+
                    "OPTIONAL{?s oacc:networkdif ?netdif.}\n"+
                    "OPTIONAL{?s oacc:networkhashrate ?nethash.}\n"+
                    "OPTIONAL{?s oacc:premineammount ?preamount.}\n"+
                    "OPTIONAL{?s oacc:price ?price.}\n"+
                    "OPTIONAL{?s oacc:projectwhitepaper ?whitepaper.}\n"+
                    "OPTIONAL{?s oacc:symbol ?symbol.}\n"+
                    "OPTIONAL{?s oacc:tag ?tag.}\n"+
                    "OPTIONAL{?s oacc:website ?website.}\n"+
                    
                    'FILTER(str(?name) = '+'"'+did+'"'+')\n'+
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var name = resList[0].name.value
            
            var dot = "digraph Coin {\n" +
                        'rankdir=TB;\n' +
                        'CC [style=filled,color="dodgerblue",shape=box,label="Cryptocurrency",href="http://localhost:3000/map"];\n' +
                        'CC -> name;\n' +
                        'name [style=filled,color="gray76",shape=box,label=' + name + '];\n'
            if(resList[0].pos != undefined){
                var pos = resList[0].pos.value
                dot+= 
                    'name -> pos;\n' +
                    'pos [style=filled,color=".7 .3 1.0",shape=box,label="Protection Scheme"];\n' +
                    'pos -> c;\n'+
                    'c [label="POS",href="http://localhost:3000/pos'
            }
            if(resList[0].pow != undefined){
                var pow = resList[0].pow.value
                dot+= 
                    'name -> pow;\n' +
                    'pow [style=filled,color=".7 .3 1.0",shape=box,label="Protection Scheme"];\n' +
                    'pow -> c;\n'+
                    'c [label="POW",href="http://localhost:3000/pow"]'
            }       
            if(resList[0].founded != undefined){
                var founded = resList[0].founded.value
                dot+= 
                    'name -> founded;\n' +
                    'founded [style=filled,color=".7 .3 1.0",shape=box,label="Foundation date"];\n' +
                    'founded -> \"'+ founded + '\";\n'
            }
            if(resList[0].about != undefined){
                var about = resList[0].about.value
                /*dot+= 
                    'name -> about;\n' +
                    'about [style=filled,color=".7 .3 1.0",shape=box,label="About"];\n' +
                    'about -> \"'+ about + '\";\n'
                */
            }
            if(resList[0].breward != undefined){
                var breward = resList[0].breward.value
                dot+= 
                    'name -> breward;\n' +
                    'breward [style=filled,color=".7 .3 1.0",shape=box,label="Block Reward"];\n' +
                    'breward -> \"'+ breward + '\";\n'
            }
            if(resList[0].btime != undefined){
                var btime = resList[0].btime.value
                dot+= 
                    'name -> btime;\n' +
                    'btime [style=filled,color=".7 .3 1.0",shape=box,label="Block Time"];\n' +
                    'btime -> \"'+ btime + '\";\n'
            }
            if(resList[0].csupply != undefined){
                var csupply = resList[0].csupply.value
                dot+= 
                    'name -> csupply;\n' +
                    'csupply [style=filled,color=".7 .3 1.0",shape=box,label="Current supply"];\n' +
                    'csupply -> \"'+ csupply + '\";\n'
            }
            if(resList[0].maxsupply != undefined){
                var maxsupply = resList[0].maxsupply.value
                dot+= 
                    'name -> maxsupply;\n' +
                    'maxsupply [style=filled,color=".7 .3 1.0",shape=box,label="Maximum supply"];\n' +
                    'maxsupply -> \"'+ maxsupply + '\";\n'
            }
            if(resList[0].icoammount != undefined){
                var icoammount = resList[0].icoammount.value
                dot+= 
                    'name -> icoammount;\n' +
                    'icoammount [style=filled,color=".7 .3 1.0",shape=box,label="Coin sold in ICO"];\n' +
                    'icoammount -> \"'+ icoammount + '\";\n'
            }
            if(resList[0].preamount != undefined){
                var preamount = resList[0].preamount.value
                dot+= 
                    'name -> preamount;\n' +
                    'preamount [style=filled,color=".7 .3 1.0",shape=box,label="Premined coins"];\n' +
                    'preamount -> \"'+ preamount + '\";\n'
            }
            if(resList[0].netdif != undefined){
                var netdif = resList[0].netdif.value
                dot+= 
                    'name -> netdif;\n' +
                    'netdif [style=filled,color=".7 .3 1.0",shape=box,label="Network difficulty"];\n' +
                    'netdif -> \"'+ netdif + '\";\n'
            }
            if(resList[0].nethash != undefined){
                var nethash = resList[0].nethash.value
                dot+= 
                    'name -> nethash;\n' +
                    'nethash [style=filled,color=".7 .3 1.0",shape=box,label="Network hashrate"];\n' +
                    'nethash -> \"'+ nethash + '\";\n'
            }
            if(resList[0].price != undefined){
                var price = resList[0].price.value
                dot+= 
                    'name -> price;\n' +
                    'price [style=filled,color=".7 .3 1.0",shape=box,label="Price"];\n' +
                    'price -> \"'+ price + '\";\n'
            }
            if(resList[0].whitepaper != undefined){
                var whitepaper = resList[0].whitepaper.value
                /*dot+= 
                    'name -> whitepaper;\n' +
                    'whitepaper [style=filled,color=".7 .3 1.0",shape=box,label="Whitepaper"];\n' +
                    'whitepaper -> \"'+ whitepaper + '\";\n'
                */
            }
            if(resList[0].symbol != undefined){
                var symbol = resList[0].symbol.value
                /*dot+= 
                    'name -> symbol;\n' +
                    'symbol [style=filled,color=".7 .3 1.0",shape=box,label="Logo"];\n' +
                    'symbol -> \"'+ symbol + '\";\n'
                */
            }
            if(resList[0].tag != undefined){
                var tag = resList[0].tag.value
                dot+= 
                    'name -> tag;\n' +
                    'tag [style=filled,color=".7 .3 1.0",shape=box,label="Tag"];\n' +
                    'tag -> \"'+ tag + '\";\n'
            }
            if(resList[0].website != undefined){
                var website = resList[0].website.value
                /*dot+= 
                    'name -> website;\n' +
                    'website [style=filled,color=".7 .3 1.0",shape=box,label="Website"];\n' +
                    'website -> \"'+ website + '\";\n'
                    */
            }
            
            dot += "}"      
            res.render("showMap", {renderingCode: 'd3.select("#graph").graphviz().renderDot(\`' + dot + '\`)'})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })    
})

module.exports = router;