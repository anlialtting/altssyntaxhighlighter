import Syntax from './Syntax.mjs'
function analyze(matchingRules,source){
    let result=[]
    while(
        match(result)||
        matchSingleCharcter(result)
    );
    return result
    function match(result){
        for(let syntaxName in matchingRules)
            if(matchBySyntaxName(syntaxName,result,true))
                return true
    }
    function matchBySyntaxName(syntaxName,result,root=false){
        if(matchingRules[syntaxName] instanceof Array){
            for(let i=0;i<matchingRules[syntaxName].length;i++)
                if(matchByRule(
                    syntaxName,
                    matchingRules[syntaxName][i],
                    result,
                    root
                ))
                    return true
            return
        }
        return matchByRule(
            syntaxName,
            matchingRules[syntaxName],
            result,
            root
        )
    }
    function matchByRule(syntaxName,rule,result,root){
        if(root&&rule.active==false)
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
        for(let i=0;i<keywords.length;i++)
            if(source.substring(0,keywords[i].length)==keywords[i]){
                result.push(new Syntax(syntaxName,[keywords[i]]))
                source=source.substring(keywords[i].length)
                return true
            }
    }
    function matchSyntaxByRegex(
        syntaxName,
        regex,
        containKeywords,
        result
    ){
        if(!regex.test(source))
            return
        let match=source.match(regex)[1]
        source=source.substring(match.length)
        let syntax=new Syntax(syntaxName)
        containKeywords&&submatch()||
        syntax.list.push(match)
        result.push(syntax)
        return true
        function submatch(){
            for(let i=0;i<containKeywords.length;i++){
                let keywords=matchingRules[containKeywords[i]].keywords
                if(keywords.indexOf(match)!=-1){
                    syntax.list.push(
                        new Syntax(containKeywords[i],[match])
                    )
                    return true
                }
            }
        }
    }
    function rangeSyntaxByRegex(
        syntaxName,
        headRegex,
        tailRegex,
        contain,
        result
    ){
        if(!headRegex.test(source))
            return
        let syntax=new Syntax(syntaxName)
        simpleMatch(headRegex,syntax.list)
        while(!source.match(tailRegex)&&(
            contain&&submatch()||
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
            try{
                match=source.match(regex)[1]
                syntax.list.push(match)
                source=source.substring(match.length)
            }catch(e){
                console.log(source,regex,source.match(regex))
                throw''
            }
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
export default analyze
