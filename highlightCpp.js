(()=>{
var
    db=new syntaxHighlighter.Database('cpp'),
    data=db.data,
    matchingRules={
        characterLiteral:{
            regex:/^('.')/,
        },
        comment:[
            {
                regex:/^(\/\/.*)\n/,
            },{
                regex:/^(\/\*(?:.|\n)*\*\/)/,
            }
        ],
        cStringLiteral:{
            regex:/^(".*")/,
        },
        identifier:{
            regex:/^([A-Z_a-z][0-9A-Z_a-z]*)/,
            containKeywords:[
                'keywords',
                'library',
                'stlcontainers',
                'constants',
            ]
        },
        numberLiteral:{
            regex:/^([0-9][0-9ELXelx.]*)/,
        },
        operator:{
            regex:/^([()\[\]{}<>+\-*\/%,:;?&^=!~.|])/,
        },
        preprocessingDirective:{
            headRegex:/^(#)/,
            tailRegex:/^(\n)/,
            contain:['comment'],
        },
        test:{
            active:false,
            keywords:['meow']
        },
        keywords:{
            active:false,
        },
        library:{
            active:false,
        },
        stlcontainers:{
            active:false,
        },
        constants:{
            active:false,
        },
    }
syntaxHighlighter.highlightCpp=highlightCpp
function highlightCpp(source,cb){
    db.require([
        'keywords',
        'library',
        'stlcontainers',
        'constants',
    ],err=>{
        var res,startTime
        if(err)
            return cb(err)
        matchingRules.keywords.keywords=data.keywords
        matchingRules.library.keywords=data.library
        matchingRules.stlcontainers.keywords=data.stlcontainers
        matchingRules.constants.keywords=data.constants
        startTime=new Date
        res=highlight(analyze(source))
        console.log((new Date)-startTime)
        cb(null,res)
    })
    function analyze(source){
/*
    N3242 2.2.2
    .   Delete "backslash character (\) immediately followed by a
        new-line character".
    .   Call analyze0().
    .   Add DeletedNewline() back.
*/
        var
            result=[],
            a=source.split('\\\n'),
        source=analyze0(a.join(''))
        a=a.map(s=>s.length)
        a.pop()
        dfs(source,result)
        return result
        function dfs(source,result){
            while(source.length){
                if(typeof source[0]=='string'){
                    if(a.length==0){
                        result.push(source[0])
                        source.shift()
                    }else{
                        if(a[0]<source[0].length){
                            result.push(source[0].substring(0,a[0]))
                            result.push(new DeletedNewline)
                            source[0]=source[0].substring(a[0])
                            a.shift()
                        }else{
                            result.push(source[0])
                            a[0]-=source[0].length
                            source.shift()
                        }
                    }
                    continue
                }
                if(typeof source[0]=='object')(()=>{
                    var list=[]
                    dfs(source[0].list,list)
                    result.push(new Syntax(source[0].syntaxName,list))
                    source.shift()
                })()
            }
            while(a.length&&a[0]==0){
                result.push(new DeletedNewline)
                a.shift()
            }
        }
    }
    function analyze0(source){
        var result=[]
        while(
            match(result)||
            matchSingleCharcter(result)
        );
        return result
        function match(result){
            var syntaxName
            for(syntaxName in matchingRules)
                if(matchBySyntaxName(syntaxName,result))
                    return true
        }
        function matchBySyntaxName(syntaxName,result){
            var i
            if(matchingRules[syntaxName] instanceof Array){
                for(i=0;i<matchingRules[syntaxName].length;i++)
                    if(matchByRule(
                        syntaxName,
                        matchingRules[syntaxName][i],
                        result
                    ))
                        return true
                return
            }
            return matchByRule(
                syntaxName,
                matchingRules[syntaxName],
                result
            )
        }
        function matchByRule(syntaxName,rule,result){
            if(rule.active==false)
                return
            if(rule.keywords)
                return matchSyntaxByKeyword(
                    syntaxName,
                    rule.keywords,
                    result
                )
            if(rule.regex)
                return matchSyntaxByRegex(
                    syntaxName,
                    rule.regex,
                    rule.containKeywords,
                    result
                )
            if(rule.headRegex)
                return rangeSyntaxByRegex(
                    syntaxName,
                    rule.headRegex,
                    rule.tailRegex,
                    rule.contain,
                    result
                )
        }
        function matchSyntaxByKeyword(syntaxName,keywords,result){
            var i
            for(i=0;i<keywords.length;i++)
                if(source.substring(0,keywords[i].length)==keywords[i]){
                    result.push(new Syntax(syntaxName,[keywords[i]]))
                    source=source.substring(keywords[i].length)
                    return true
                }
        }
        function matchSyntaxByRegex(syntaxName,regex,containKeywords,result){
            var
                syntax,
                match
            if(!regex.test(source))
                return
            match=source.match(regex)[1]
            source=source.substring(match.length)
            syntax=new Syntax(syntaxName)
            containKeywords&&submatch()||
            syntax.list.push(match)
            result.push(syntax)
            return true
            function submatch(){
                var i,j,keywords
                for(i=0;i<containKeywords.length;i++){
                    keywords=matchingRules[containKeywords[i]].keywords
                    if(keywords.indexOf(match)!=-1){
                        syntax.list.push(new Syntax(containKeywords[i],[match]))
                        return true
                    }
                }
            }
        }
        function rangeSyntaxByRegex(syntaxName,headRegex,tailRegex,contain,result){
            var
                syntax
            if(!headRegex.test(source))
                return
            syntax=new Syntax(syntaxName)
            simpleMatch(headRegex,syntax.list)
            while(!source.match(tailRegex)&&(
                submatch()||
                matchSingleCharcter(syntax.list)
            ));
            simpleMatch(tailRegex,syntax.list)
            result.push(syntax)
            return true
            function submatch(){
                var i
                for(i=0;i<contain.length;i++)
                    if(matchBySyntaxName(contain[i],syntax.list))
                        return true
            }
            function simpleMatch(regex,result){
                var match
                match=source.match(regex)[1]
                syntax.list.push(match)
                source=source.substring(match.length)
            }
        }
        function matchSingleCharcter(result){
            if(!source.length)
                return
            result.push(source[0])
            source=source.substring(1)
            return true
        }
    }
    function highlight(list){
        var result=''
        list.forEach(item=>{
            if(typeof item=='string')
                result+=syntaxHighlighter.htmltextencode(item)
            if(item instanceof DeletedNewline)
                result+='\\\n'
            if(typeof item=='object'&&matchingRules[item.syntaxName]){
                result+=`<span class="${item.syntaxName}">${
                    highlight(item.list)
                }</span>`
            }
        })
        return result
    }
    function DeletedNewline(list){
        this.list=list||[]
    }
    function Syntax(syntaxName,list){
        this.syntaxName=syntaxName
        this.list=list||[]
    }
}
})()
