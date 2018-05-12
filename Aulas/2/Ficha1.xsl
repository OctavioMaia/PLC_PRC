<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:ex="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <rdf:RDF 
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
            xmlns:ex="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#"
            xml:base="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#">
            
            <rdf:Description rdf:ID="Publicacao">
                <rdf:type rdf:resource="rdfs:Class"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Proceedings">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="InProceedings">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Article">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Misc">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="PhdThesis">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="MasterThesis">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Publicacao"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Pessoa">
                <rdf:type rdf:resource="rdfs:Class"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Autor">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Pessoa"/>
            </rdf:Description>
            <rdf:Description rdf:ID="Editor">
                <rdf:type rdf:resource="rdfs:Class"/>
                <rdfs:subClassOf rdf:resource="ex:Pessoa"/>
            </rdf:Description>
            <!-- ..........Propriedades..........................-->
            <rdfs:Datatype rdf:about="http://www.w3.org/2001/XMLSchema#string"/>
            <rdf:Property rdf:ID="nome">
                <rdfs:domain rdf:resource="ex:Pessoa"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            <rdf:Property rdf:ID="temAutor">
                <rdfs:domain rdf:resource="ex:Publicacao"/>
                <rdfs:range rdf:resource="ex:Pessoa"/>
            </rdf:Property>
            <rdf:Property rdf:ID="temEditor">
                <rdfs:domain rdf:resource="ex:Publicacao"/>
                <rdfs:range rdf:resource="ex:Pessoa"/>
            </rdf:Property>
            <rdf:Property rdf:ID="data">
                <rdfs:domain rdf:resource="ex:Publicacao"/>
            </rdf:Property>
            <rdf:Property rdf:ID="titulo">
                <rdfs:domain rdf:resource="ex:Publicacao"/>
            </rdf:Property>
            <rdf:Property rdf:ID="doi">
                <rdfs:domain rdf:resource="ex:Publicacao"/>
            </rdf:Property>
            
            <xsl:comment>....Indivíduos...............................</xsl:comment>
            <xsl:comment>>>>>> Autores</xsl:comment>
            <xsl:apply-templates select="bibliography/*/author" mode="author"/>
            <xsl:comment>>>>>> Publicações</xsl:comment>
            <xsl:apply-templates select="bibliography/*"/>
            
        </rdf:RDF>
    </xsl:template>
    
    <xsl:template match="bibliography/*">
        <ex:Inproceedings rdf:ID="{@id}">
            <ex:titulo><xsl:value-of select="title"/></ex:titulo>
            <xsl:apply-templates select="author|author-ref"/>
            <ex:data><xsl:value-of select="year"/></ex:data> 
            <xsl:if test="doi">
                <ex:doi><xsl:value-of select="doi"/></ex:doi>
            </xsl:if>
        </ex:Inproceedings>
    </xsl:template>
    
    <xsl:template match="author" mode="author">
        <ex:Pessoa rdf:ID="{@id}">
            <ex:nome><xsl:value-of select="."/></ex:nome>
        </ex:Pessoa>
    </xsl:template>
    
    <xsl:template match="author">
        <ex:temAutor rdf:resource="ex:{@id}"/>
    </xsl:template>
    
    <xsl:template match="author-ref">
        <ex:temAutor rdf:resource="ex:{@authorid}"/>
    </xsl:template>
</xsl:stylesheet>