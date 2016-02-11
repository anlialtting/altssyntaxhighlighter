(()=>{
var
    db=new syntaxHighlighter.Database('cpp'),
    regexOfOperators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/,
    regexOfSpecifier=/^[A-Za-z_][0-9A-Za-z_]*/,
    regexOfNumberLiteral=/^[0-9][0-9ELXelx.]*/
syntaxHighlighter.highlightCpp=highlightCpp
function highlightCpp(code,cb){
    var
        input=code,
        output='',
        data=db.data
    db.require([
        'keywords',
        'library',
        'stlcontainers',
        'constants',
    ],err=>{
        if(err)
            return cb(err)
        highlightCppCode()
        cb(null,output)
    })
    function highlightCppCode(){
        while(
            tryHighlightSingleLineComment()||
            tryHighlightMultiLineComment()||
            tryHighlightPreprocessorInstruction()||
            tryHighlightOperators()||
            tryHighlightCharacterLiteral()||
            tryHighlightCStringLiteral()||
            tryHighlightSpecifier()||
            tryHighlightNumberLiteral()||
            tryHighlightSingleCharacter()
        );
    }
    function tryHighlightSpecifier(){
        if(!regexOfSpecifier.test(input))
            return
        highlightSpecifier()
        return true
    }
    function highlightSpecifier(){
        var token=input.match(regexOfSpecifier)[0]
        if(data.keywords.indexOf(token)!=-1)
            output+='<span class="keywords">'+token+'</span>'
        else if(data.library.indexOf(token)!=-1)
            output+='<span class="library">'+token+'</span>'
        else if(data.stlcontainers.indexOf(token)!=-1)
            output+='<span class="stlcontainers">'+token+'</span>'
        else if(data.constants.indexOf(token)!=-1)
            output+='<span class="constants">'+token+'</span>'
        else
            output+=token
        input=input.substring(token.length)
    }
    function tryHighlightNumberLiteral(){
        if(!regexOfNumberLiteral.test(input))
            return
        highlightNumberLiteral()
        return true
    }
    function highlightNumberLiteral(){
        var token=input.match(regexOfNumberLiteral)[0]
        output+=
            '<span class="number">'+
            token+
            '</span>'
        input=input.substring(token.length)
    }
    function tryHighlightSingleCharacter(){
        if(input.length==0)
            return
        highlightSingleCharacter()
        return true
    }
    function highlightSingleCharacter(){
        output+=syntaxHighlighter.htmltextencode(input[0])
        input=input.substring(1)
    }
    function tryHighlightPreprocessorInstruction(){
        if(input[0]!='#')
            return
        highlightPreprocessorInstruction()
        return true
    }
    function highlightPreprocessorInstruction(){
        output+='<span class="preprocessorInstruction">'
        while(input[0]!='\n'&&(
            tryHighlightIncludePI()||
            tryHighlightSingleLineComment()||
            tryHighlightMultiLineComment()||
            tryHighlightIgnoredNewlineCharacter()||
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        ));
        output+='</span>'
    }
    function tryHighlightIncludePI(){
        if(!/^include/.test(input))
            return
        highlightIncludePI()
        return true
    }
    function highlightIncludePI(){
        output+=syntaxHighlighter.htmltextencode(input.substring(0,7))
        input=input.substring(7)
        output+='<span class="includePI">'
        while(input[0]!='\n'&&(
            tryHighlightSingleLineComment()||
            tryHighlightMultiLineComment()||
            tryHighlightIgnoredNewlineCharacter()||
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        ));
        output+='</span>'
    }
    function tryHighlightSingleLineComment(){
        if(input.substring(0,2)!='//')
            return
        highlightSingleLineComment()
        return true
    }
    function highlightSingleLineComment(){
        output+='<span class="singleLineComment">'
        while(input[0]!='\n'&&(
            tryHighlightIgnoredNewlineCharacter()||
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        ));
        output+='</span>'
    }
    function tryHighlightMultiLineComment(){
        if(input.substring(0,2)!='/*')
            return
        highlightMultiLineComment()
        return true
    }
    function highlightMultiLineComment(){
        output+='<span class="multiLineComment">'
        while(input.length){
            if(input.substring(0,2)=='*/'){
                highlightSingleCharacter()
                highlightSingleCharacter()
                break
            }
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        }
        output+='</span>'
    }
    function tryHighlightBlackslashInLiteral(){
        if(input[0]!='\\')
            return
        highlightBlackslashInLiteral()
        return true
    }
    function highlightBlackslashInLiteral(){
        highlightSingleCharacter()
        highlightSingleCharacter()
    }
    function tryHighlightCharacterLiteral(){
        if(input[0]!='\'')
            return
        highlightCharacterLiteral()
        return true
    }
    function highlightCharacterLiteral(){
        var state
        output+='<span class="characterLiteral">'
        state=0
        while(input.length){
            if(state==2)
                break
            if(input[0]=='\'')
                state++
            tryHighlightIgnoredNewlineCharacter()||
            tryHighlightBlackslashInLiteral()||
            tryHighlightSingleCharacter()
        }
        output+='</span>'
    }
    function tryHighlightCStringLiteral(){
        if(input[0]!='"')
            return
        highlightCStringLiteral()
        return true
    }
    function highlightCStringLiteral(){
        var state
        output+='<span class="cStringLiteral">'
        state=0
        while(input.length){
            if(state==2)
                break
            if(input[0]=='"')
                state++
            tryHighlightIgnoredNewlineCharacter()||
            tryHighlightBlackslashInLiteral()||
            tryHighlightSingleCharacter()
        }
        output+='</span>'
    }
    function tryHighlightOperators(){
        if(!regexOfOperators.test(input[0]))
            return
        highlightOperators()
        return true
    }
    function highlightOperators(){
        output+='<span class="operators">'
        highlightSingleCharacter()
        output+='</span>'
    }
    function tryHighlightIgnoredNewlineCharacter(){
        if(input.substring(0,2)!='\\\n')
            return
        highlightIgnoredNewlineCharacter()
        return true
    }
    function highlightIgnoredNewlineCharacter(){
        highlightSingleCharacter()
        dehighlightNewlineCharacter()
    }
    function tryDehighlightNewlineCharacter(){
        if(input[0]!='\n')
            return
        dehighlightNewlineCharacter()
        return true
    }
    function dehighlightNewlineCharacter(){
        var
            traveler=arguments.callee,
            ancestors=[],
            openers=[]
        while(traveler.name!='highlightCppCode'){
            if(/^highlight/.test(traveler.name))
                ancestors.push(traveler.name)
            traveler=traveler.caller
        }
        output+=ancestors.map(functionName=>{
            if([
                'highlightOperators',
                'highlightNumberLiteral',
                'highlightCharacterLiteral',
                'highlightCStringLiteral',
                'highlightMultiLineComment',
                'highlightSingleLineComment',
                'highlightPreprocessorInstruction',
            ].indexOf(functionName)!=-1)
                return'</span>'
            return''
        }).join('')
        output+=syntaxHighlighter.htmltextencode(input[0])
        input=input.substring(1)
        ancestors.reverse()
        output+=ancestors.map(functionName=>{
            if(functionName=='highlightOperators')
                return'<span class="operators">'
            if(functionName=='highlightNumberLiteral')
                return'<span class="number">'
            if(functionName=='highlightCharacterLiteral')
                return'<span class="characterLiteral">'
            if(functionName=='highlightCStringLiteral')
                return'<span class="cStringLiteral">'
            if(functionName=='highlightMultiLineComment')
                return'<span class="multiLineComment">'
            if(functionName=='highlightSingleLineComment')
                return'<span class="singleLineComment">'
            if(functionName=='highlightPreprocessorInstruction')
                return'<span class="preprocessorInstruction">'
            return''
        }).join('')
    }
}
})()
