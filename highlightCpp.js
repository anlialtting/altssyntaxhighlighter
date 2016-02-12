(()=>{
var
    db=new syntaxHighlighter.Database('cpp')
syntaxHighlighter.highlightCpp=highlightCpp
function highlightCpp(source,cb){
    var
        data=db.data
    db.require([
        'keywords',
        'library',
        'stlcontainers',
        'constants',
    ],err=>{
        if(err)
            return cb(err)
        cb(null,highlight(analyze(source)))
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
                if(typeof source[0]=='object')(c=>{
                    dfs(source[0].list,c)
                    result.push(new source[0].constructor(c))
                    source.shift()
                })([])
            }
            while(a.length&&a[0]==0){
                result.push(new DeletedNewline)
                a.shift()
            }
        }
    }
    function analyze0(sourceFile){
        var result=[]
        while(
            matchCharacterLiteral(result)||
            matchComment(result)||
            matchCStringLiteral(result)||
            matchIdentifier(result)||
            matchNumberLiteral(result)||
            matchOperator(result)||
            matchPreprocessingDirective(result)||
            matchSingleCharcter(result)
        );
        return result
        function matchCharacterLiteral(result){ // 0
            var m=sourceFile.match(/^'.'/)
            if(!m)
                return
            m=m[0]
            result.push(new CharacterLiteral([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchComment(result){ // 0
            var m=sourceFile.match(/^(\/\/.*\n|\/\*(.|\n)*\*\/)/)
            if(!m)
                return
            m=m[0]
            result.push(new Comment([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchCStringLiteral(result){ // 0
            var m=sourceFile.match(/^".*"/)
            if(!m)
                return
            m=m[0]
            result.push(new CStringLiteral([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchIdentifier(result){ // 0
            var m=sourceFile.match(/^[A-Z_a-z][0-9A-Z_a-z]*/)
            if(!m)
                return
            m=m[0]
            result.push(new Identifier([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchNumberLiteral(result){ // 0
            var m=sourceFile.match(/^[0-9][0-9ELXelx.]*/)
            if(!m)
                return
            m=m[0]
            result.push(new NumberLiteral([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchOperator(result){ // 0
            var m=sourceFile.match(/^[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/)
            if(!m)
                return
            m=m[0]
            result.push(new Operator([m]))
            sourceFile=sourceFile.substring(m.length)
            return true
        }
        function matchPreprocessingDirective(result){ // 0
            var m=sourceFile.match(/^#/)
            if(!m)
                return
            m=m[0]
            result.push(new PreprocessingDirective)
            matchSingleCharcter(result[result.length-1].list)
            while(!sourceFile.match(/^\n/)){
                matchComment(result[result.length-1].list)||
                matchSingleCharcter(result[result.length-1].list)
            }
            matchSingleCharcter(result[result.length-1].list)
            return true
        }
        function matchSingleCharcter(result){ // 1
            if(!sourceFile.length)
                return
            result.push(sourceFile[0])
            sourceFile=sourceFile.substring(1)
            return true
        }
    }
    function highlight(list){
        var result=''
        list.forEach(item=>{
            if(typeof item=='string')
                result+=syntaxHighlighter.htmltextencode(item)
            if(item instanceof DeletedNewline)
                result+='<span>\\\n</span>'
            if(item instanceof CharacterLiteral)
                result+=`<span class="characterLiteral">${
                    highlight(item.list)
                }</span>`
            if(item instanceof Comment)
                result+=`<span class="comment">${
                    highlight(item.list)
                }</span>`
            if(item instanceof CStringLiteral)
                result+=`<span class="cStringLiteral">${
                    highlight(item.list)
                }</span>`
            if(item instanceof Identifier)(token=>{
                if(data.keywords.indexOf(token)!=-1)
                    result+='<span class="keywords">'+token+'</span>'
                else if(data.library.indexOf(token)!=-1)
                    result+='<span class="library">'+token+'</span>'
                else if(data.stlcontainers.indexOf(token)!=-1)
                    result+='<span class="stlcontainers">'+token+'</span>'
                else if(data.constants.indexOf(token)!=-1)
                    result+='<span class="constants">'+token+'</span>'
                else
                    result+=token
            })(highlight(item.list))
            if(item instanceof NumberLiteral)
                result+=`<span class="numberLiteral">${
                    highlight(item.list)
                }</span>`
            if(item instanceof Operator)
                result+=`<span class="operator">${
                    highlight(item.list)
                }</span>`
            if(item instanceof PreprocessingDirective)
                result+=`<span class="preprocessingDirective">${
                    highlight(item.list)
                }</span>`
        })
        return result
    }
    function DeletedNewline(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function CharacterLiteral(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function Comment(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function CStringLiteral(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function Identifier(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function NumberLiteral(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function Operator(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
    function PreprocessingDirective(list){
        this.list=list||[]
        this.valueOf=()=>{
            return this.list
        }
    }
}
})()
