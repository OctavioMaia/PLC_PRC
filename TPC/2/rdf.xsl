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
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
            xmlns:ex="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#"
            xml:base="http://www.di.uminho.pt/jcr/XML/rdf/exercicio#">
            <rdf:Description rdf:ID="UC">
                <rdf:type rdf:resource="rdfs:Class"/>
            </rdf:Description>
            
            <rdf:Description rdf:ID="Graduation">
                <rdf:type rdf:resource="rdfs:Class"/>
            </rdf:Description>
            
            <rdf:Property rdf:ID="name">
                <rdfs:domain rdf:resource="ex:UC"/>
                <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="year">
                <rdfs:domain rdf:resource="ex:UC"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="url">
                <rdfs:domain rdf:resource="ex:UC"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="numberStudents">
                <rdfs:domain rdf:resource="ex:UC"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="course">
                <rdfs:domain rdf:resource="ex:UC"/>
                <rdfs:range rdf:resource="ex:Graduation"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="hasProject">
                <rdfs:domain rdf:resource="ex:UC"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="year">
                <rdfs:domain rdf:resource="ex:UC"/>
            </rdf:Property>
            
            <rdf:Property rdf:ID="gradName">
                <rdfs:domain rdf:resource="ex:Graduation"/>
            </rdf:Property>
            
            <xsl:apply-templates select="courses/course/grad[not(preceding::acr/normalize-space(.)=normalize-space(./acr))]"/>
            <xsl:apply-templates select="courses/course"/>
        </rdf:RDF>
    </xsl:template>
    
    <xsl:template match="grad">
        <xsl:variable name="p" select="acr"/>
        <ex:Graduation rdf:ID="{$p}">
            <ex:gradName><xsl:value-of select="name"/></ex:gradName>
        </ex:Graduation>
    </xsl:template>
    
    <xsl:template match="course">
        <ex:UC rdf:ID="{generate-id()}">
            <ex:name>
                <xsl:value-of select="name"/>
            </ex:name>
            
            <ex:year>
                <xsl:value-of select="year"/>
            </ex:year>
            
            <xsl:if test="url">
                <ex:url><xsl:value-of select="url"/></ex:url>
            </xsl:if>
            
            <ex:numberStudents>
                <xsl:value-of select="students"/>
            </ex:numberStudents>
            
            <xsl:variable name="x" select="grad/acr"/>
            
            <ex:course rdf:resource="{$x}"/>
            
            <ex:year>
                <xsl:value-of select="grad/year"/>
            </ex:year>
            
            <xsl:if test="desc">
                <ex:hasProject>
                    <xsl:value-of select="li"/>
                </ex:hasProject>
            </xsl:if>             
        </ex:UC>
    </xsl:template>
</xsl:stylesheet>