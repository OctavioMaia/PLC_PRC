$(function(){
    $('#intext').val('')
    
    $('#proc').click(()=>{
        var textSource = {
            'intext' : $('#intext').val()
        }
        $.ajax({
            type : 'POST',
            data : textSource,
            url :  '/',
            dataType : 'JSON'
        }).done((response) => {
            var colunas = response.head.vars
            var html = "<table class='w3-table-all'>\n"
            html += '<tr>'
            for(var col in colunas)
                html += '<th>' + colunas[col] + '</th>'
            html += '</tr>\n'

            for(var key in response.results.bindings){
                var linha = response.results.bindings[key]
                html += '<tr>'
                for(var col in colunas)
                    html += '<td>' + linha[colunas[col]].value + '</td>'
                html += '</tr>\n'
            }

            html += '</table>\n'

            $('resultado').appent(html)
        })
    })
    $('#limpa').click(()=>{
        $('#resultado').children().remove()
    })  

    $('#nova').click(()=>{
        $('#intext').val('')
    })
})