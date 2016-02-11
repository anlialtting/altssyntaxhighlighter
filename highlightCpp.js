(()=>{
var
    db=new syntaxHighlighter.Database('cpp'),
    regexOfOperators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/,
    regexOfSpecifier=/^[A-Za-z_][0-9A-Za-z_]*/,
    regexOfNumberLiteral=/^[0-9][0-9ELXelx.]*/
syntaxHighlighter.highlightCpp=highlightCpp
function _highlightCpp(sourceFile,cb){
    cb(null,highlight(analyze(sourceFile)))
    function analyze(sourceFile){
        var
            result=[]
        a=sourceFile.split('\\\n')
        b=analyze0(a.join(''))
        a=a.map(s=>s.length)
        a.pop()
        while(a.length&&b.length){
            if(typeof b[0]!='string'){
                result.push(b.shift())
                continue
            }
            if(a[0]<b[0].length){
                result.push(b[0].substring(0,a[0]))
                result.push(new DeletedNewline)
                b[0]=b[0].substring(a[0])
                a.shift()
            }else{
                result.push(b[0])
                a[0]-=b[0].length
                b.shift()
            }
        }
        while(a.length){
            result.push(new DeletedNewline)
            a.shift()
        }
        while(b.length){
            result.push(b[0])
            b.shift()
        }
        return result
    }
    function analyze0(sourceFile){
        var a=sourceFile.split('\n').map(s=>s+'\n')
        a.pop()
        return a
    }
    function highlight(list){
        var result=''
        list.forEach(item=>{
            if(typeof item=='string')
                result+=syntaxHighlighter.htmltextencode(item)
            if(item instanceof DeletedNewline)
                result+='<span style="color:green">\\\n</span>'
        })
        return result
    }
    function DeletedNewline(){
    }
}
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
        highlightSingleCharacter()
    }
}
})()
