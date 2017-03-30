;(async()=>{
    module.repository=await module.importByPath('https://cdn.rawgit.com/anliting/althea/5c49592c8779c5f5387345a3d4da25a5de55fb26/src/AltheaServer/HttpServer/files/lib/repository.js',{mode:1})
    let[
        dom,
        html,
    ]=await Promise.all([
        module.repository.althea.dom,
        module.repository.althea.html,
    ])
    let
        modules=new Cache(evalScript),
        options=window.syntaxHighlighter
    loadCSS('highlighter.css')
    syntaxHighlighter.Database=Database
    syntaxHighlighter.analyze=analyze
    syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze
    syntaxHighlighter.highlight=highlight
    syntaxHighlighter.highlight_all=highlight_all
    syntaxHighlighter.border_all=border_all
    function syntaxHighlighter(){
        highlight_all(null,()=>{
            border_all()
        })
    }
    async function evalScript(path){
        return eval(await module.get(path))
    }
    async function loadCSS(path,callback){
        let res=await module.get(path)
        var style=dom('style')
        style.innerHTML=res
        document.head.appendChild(style)
        callback&&callback(null)
    }
    function text_border(s){
        var
            countOfLines,
            logCountOfLines
        s=splitSourceByNewlineCharacter(s)
        countOfLines=s.split('\n').length-1
        logCountOfLines=Math.floor(Math.round(
            Math.log(countOfLines)/Math.log(10)*1e6
        )/1e6)
        return table()
        function splitSourceByNewlineCharacter(source){
            let div=dom('div')
            div.innerHTML=source
            return splitElementByNewlineCharacter(div)
        }
        function splitElementByNewlineCharacter(e){
            var
                result='',
                i
            for(i=0;i<e.childNodes.length;i++){
                let node=e.childNodes[i]
                result+=node.nodeType==Node.TEXT_NODE?
                    html.encodeText(node.wholeText)
                :
                    splitElementByNewlineCharacter(
                        node
                    ).split('\n').map(s=>(
                        node.innerHTML=s,
                        node.outerHTML
                    )).join('\n')
            }
            return result
        }
        function table(){
            let lines=s.split('\n')
            lines.pop()
            lines=lines.map(s=>s+'\n')
            return dom('table',
                lines.map((e,i)=>
                    tr(i,e)
                )
            )
        }
        function tr(i,s){
            return dom('tr',
                tr=>{tr.dataset.lineNumber=i+1},
                td_lineNumber(i),
                td_content(s)
            )
        }
        function td_lineNumber(i){
            return dom('td',{className:'lineNumber'},td=>{
                td.dataset.lineNumber=i+1
                td.style.width=6*(logCountOfLines+1)+'pt'
            })
        }
        function td_content(s){
            return dom('td',{className:'content',innerHTML:s})
        }
    }
    async function highlight_all(e){
        var
            highlighters=[{
                header:'highlightCpp.js',
                selector:'.highlighted_cpp',
                functionName:'highlightCpp',
            },{
                header:'highlightHtml.js',
                selector:'.highlighted_html',
                functionName:'highlightHtml',
            },{
                header:'highlightJs.js',
                selector:'.highlighted_js',
                functionName:'highlightJs',
            },{
                header:'highlightTex.js',
                selector:'.highlighted_tex',
                functionName:'highlightTex',
            }]
        e=e||document
        await Promise.all(highlighters.map(async highlighter=>{
            if(e.querySelectorAll(highlighter.selector).length==0)
                return
            await modules.require(highlighter.header)
            await Promise.all([
                f0(highlighter),
                f1(highlighter),
                f2(highlighter),
            ])
        }))
        async function f0(highlighter){
            await Promise.all([
                ...e.querySelectorAll('span'+highlighter.selector)
            ].map(async e=>{
                e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.textContent)
                e.style.visibility=''
            }))
        }
        async function f1(highlighter){
            await Promise.all([
                ...e.querySelectorAll('div'+highlighter.selector)
            ].map(async e=>{
                /*e.ondblclick=()=>{
                    e.contentEditable=true
                }*/
                e.onkeydown=event=>{
                    var cursorPosition
                    event.stopPropagation()
                    console.log(event.keyCode)
                    if(event.keyCode==37){
                        event.preventDefault()
                        cursorPosition=
                            getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
                        goto(e,Math.max(0,cursorPosition-1),0)
                    }
                    if(event.keyCode==38){
                        event.preventDefault()
                    }
                    if(event.keyCode==39){
                        event.preventDefault()
                        cursorPosition=
                            getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
                        goto(e,Math.min(e.textContent.length,cursorPosition+1),0)
                    }
                }
                e.oninput=async event=>{
                    var range,cursorPosition
                    range=document.getSelection().getRangeAt(0)
                    if(range.startContainer!=range.endContainer||range.startOffset!=range.endOffset)
                        return
                    cursorPosition=getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
                    var a=e.querySelectorAll('.content')
                    for(var j=0;j<a.length;j++)
                        if(!/\n$/.test(a[j].textContent))
                            a[j].textContent+='\n'
                    if(!/\n$/.test(e.textContent))
                        e.textContent+='\n'
                    e.innerHTML=''
                    e.appendChild(text_border(
                        await syntaxHighlighter[highlighter.functionName](e.textContent)
                    ))
                    goto(e,cursorPosition,0)
                }
                e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.textContent)
                if(!e.classList.contains('bordered'))
                    e.style.visibility=''
                function getCharacterOffsetWithin(range,node){
                    var treeWalker=document.createTreeWalker(
                        node,
                        NodeFilter.SHOW_TEXT,
                        node=>{
                            var nodeRange=document.createRange()
                            nodeRange.selectNode(node)
                            return nodeRange.compareBoundaryPoints(Range.END_TO_END,range)<1?
                                NodeFilter.FILTER_ACCEPT
                            :
                                NodeFilter.FILTER_REJECT
                        }
                    )
                    var charCount=0
                    while(treeWalker.nextNode())
                        charCount+=treeWalker.currentNode.length
                    if(range.startContainer.nodeType==3)
                        charCount+=range.startOffset
                    return charCount
                }
                function goto(node,position,which){
                    var treeWalker=document.createTreeWalker(
                        node,
                        NodeFilter.SHOW_TEXT
                    )
                    var charCount=0
                    while(treeWalker.nextNode()){
                        if(position<charCount+treeWalker.currentNode.length){
                            var selection=window.getSelection()
                            var range=document.createRange()
                            if(which==0){
                                range.setStart(treeWalker.currentNode,position-charCount)
                                range.setEnd(treeWalker.currentNode,position-charCount)
                            }else if(which==1){
                                range.setStart(treeWalker.currentNode,position-charCount)
                            }else if(which==2){
                                range.setEnd(treeWalker.currentNode,position-charCount)
                            }
                            selection.removeAllRanges()
                            selection.addRange(range)
                            return
                        }
                        charCount+=treeWalker.currentNode.length
                    }
                }
            }))
        }
        async function f2(highlighter){
            await Promise.all([
                ...e.querySelectorAll('script'+highlighter.selector)
            ].map(async e=>{
                e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.innerHTML)
                if(!e.classList.contains('bordered'))
                    replaceByDiv(e)
            }))
        }
    }
    async function border_all(e){
        e=e||document
        ;(()=>{
            var a,i,source
            a=e.querySelectorAll('div.bordered')
            for(i=0;i<a.length;i++){
                source=a[i].innerHTML
                a[i].innerHTML=''
                a[i].appendChild(text_border(source))
                a[i].style.visibility=''
            }
        })()
        ;(()=>{
            var a,i,source
            a=e.querySelectorAll('script.bordered')
            for(i=0;i<a.length;i++){
                source=a[i].innerHTML
                a[i].innerHTML=''
                a[i].appendChild(text_border(source))
                replaceByDiv(a[i])
            }
        })()
    }
    function replaceByDiv(e){
        var div=dom('div'),i
        for(i=0;i<e.classList.length;i++)
            div.classList.add(e.classList[i])
        div.appendChild(e.firstChild)
        e.parentNode.insertBefore(div,e)
        e.parentNode.removeChild(e)
        return div
    }
    function newlineDeletedAnalyze(matchingRules,source){
    /*
    C++
    N3242 2.2.2
    .   Delete "backslash character (\) immediately followed by a
        new-line character".
    .   Call analyze0().
    .   Add DeletedNewline() back.
    */
        var
            result=[],
            a=source.split('\\\n'),
        source=analyze(matchingRules,a.join(''))
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
                            result.push(new Syntax(
                                'deletedNewline',
                                ['\\\n']
                            ))
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
                result.push(new Syntax('deletedNewline',['\\\n']))
                a.shift()
            }
        }
    }
    function analyze(matchingRules,source){
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
            if(
                arguments.callee.caller.caller.name=='match'&&
                rule.active==false
            )
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
        function matchSyntaxByRegex(
                syntaxName,
                regex,
                containKeywords,
                result
            ){
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
            var
                syntax
            if(!headRegex.test(source))
                return
            syntax=new Syntax(syntaxName)
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
    function highlight(list){
        return list.map(item=>{
            if(typeof item=='string')
                return html.encodeText(item)
            else if(typeof item=='object')
                return `<span class=${item.syntaxName}>${
                    highlight(item.list)
                }</span>`
        }).join('')
    }
    function Syntax(syntaxName,list){
        this.syntaxName=syntaxName
        this.list=list||[]
    }
    function Database(name){
        Cache.call(this,async(key)=>{
            this.data[key]=JSON.parse(await module.get(`${name}/${key}.json`))
        })
        this.data={}
    }
    Database.prototype=Object.create(Cache.prototype)
    function Cache(load){
        this.load=load
        this.status={}
        this.onLoad={}
    }
    Cache.prototype.require=async function(key){
        if(key instanceof Array)
            return Promise.all(key.map(key=>this.require(key)))
        if(!this.onLoad[key])
            this.onLoad[key]=this.load(key)
        return this.onLoad[key]
    }
    return syntaxHighlighter
})()
