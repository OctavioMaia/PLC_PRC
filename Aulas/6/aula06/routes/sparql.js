var express = require('express');
var router = express.Router();

var SparqlClient = require('sparql-client-2')
var SPARQL = SparqlClient.SPARQL

var endpoint = 'http://epl.di.uminho.pt:40003/repositories/m51-clav-jcr'
var myUpdateEndpoint = 'http://epl.di.uminho.pt:40003/repositories/m51-clav-jcr/statements'

var client = new SparqlClient(endpoint, {
    updateEndpoint : myUpdateEndpoint,
    defaultParameters : {format: 'json'}
}).register({
    rdf: 'http://ww.w3.org/1999/02/22-rdf-syntax-ns#',
    clav: 'http://jcr.di.uminho.pt/m51-clav#',
    owl: 'http://www.w3.org/2002/07/owl#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    noInferences: 'http://www.ontotext.com/explicit'
})

router.get('/', (req, res, next) =>{
  res.render('workbench');
});

router.post('/', (req,res,next) =>{
    var query = req.body.intext
    client.query(query).execute().then((qres)=>{
        console.log('\n\n')
        JSON.stringify(qres)
        res.json(qres)
    }).catch((error)=>{
        console.log('ERRO: ' + error)
    })
})

module.exports = router;
