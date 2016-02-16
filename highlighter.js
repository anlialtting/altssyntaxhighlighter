(()=>{
var
    directoryOfThisScript=
        document.currentScript.getAttribute('src').replace(/[^\/]*$/,''),
    modules=new Cache(evalScript),
    options=window.syntaxHighlighter
window.syntaxHighlighter=syntaxHighlighter
document.currentScript.addEventListener('load',process)
loadCSS('highlighter.css')
syntaxHighlighter.Database=Database
syntaxHighlighter.analyze=analyze
syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze
syntaxHighlighter.highlight=highlight
syntaxHighlighter.htmltextencode=htmltextencode
syntaxHighlighter.highlight_all=highlight_all
syntaxHighlighter.border_all=border_all
function syntaxHighlighter(){
    highlight_all(null,()=>{
        border_all()
    })
}
function process(){
    if(options===undefined){
        syntaxHighlighter()
        return
    }
}
function getResource(path,callback){
    var request=new XMLHttpRequest
    request.onreadystatechange=()=>{
        if(request.readyState===4&&request.status===200){
            callback&&callback(null,request.responseText)
        }
    }
    request.open('GET',path)
    request.send()
}
function get(path,callback){
    getResource(directoryOfThisScript+path,(err,res)=>{
        callback&&callback(null,res)
    })
}
function evalScript(path,callback){
    getResource(directoryOfThisScript+path,(err,res)=>{
        var result=eval(res)
        callback&&callback(null,result)
    })
}
function loadCSS(path,callback){
    getResource(directoryOfThisScript+path,(err,res)=>{
        var style=document.createElement('style')
        style.innerHTML=res
        document.head.appendChild(style)
        callback&&callback(null)
    })
}
function htmltextencode(s){
    var e=document.createElement('div')
    e.textContent=s
    return e.innerHTML
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
        var
            result='',
            div=document.createElement('div'),
            i
        div.innerHTML=source
        for(i=0;i<div.childNodes.length;i++)(node=>
            result+=node.nodeType==Node.TEXT_NODE?
                (s=>{
                    var div=document.createElement('div')
                    div.textContent=s
                    return div.innerHTML
                })(node.wholeText)
            :
                splitSourceByNewlineCharacter(
                    node.innerHTML
                ).split('\n').map(s=>(
                    node.innerHTML=s,
                    node.outerHTML
                )).join('\n')
        )(div.childNodes[i])
        return result
    }
    function table(){
        var
            table,
            lines
        table=document.createElement('table')
        lines=s.split('\n')
        lines.pop()
        lines.forEach((e,i)=>{
            table.appendChild(tr(i,e))
        })
        return table
    }
    function tr(i,s){
        var
            tr
        tr=document.createElement('tr')
        tr.appendChild(td_lineNumber(i))
        tr.appendChild(td_content(s))
        return tr
    }
    function td_lineNumber(i){
        var
            td
        td=document.createElement('td')
        td.className='lineNumber'
        td.dataset.lineNumber=i+1
        td.style.width=6*(logCountOfLines+1)+'pt'
        return td
    }
    function td_content(s){
        var
            td
        td=document.createElement('td')
        td.className='content'
        td.innerHTML=s
        return td
    }
}
function highlight_all(e,cb){
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
    countdownToCallback.count=1
    highlighters.forEach(highlighter=>{
        if(e.querySelectorAll(highlighter.selector).length==0)
            return
        countdownToCallback.count+=3
        modules.require(highlighter.header,()=>{
            ;(()=>{
                var a,i
                a=e.querySelectorAll('span'+highlighter.selector)
                countdownToCallback.count+=a.length
                for(i=0;i<a.length;i++)(e=>{
                    syntaxHighlighter[highlighter.functionName](e.textContent,(err,res)=>{
                        e.innerHTML=res
                        e.style.visibility=''
                        countdownToCallback()
                    })
                })(a[i])
                countdownToCallback()
            })()
            ;(()=>{
                var a,i
                a=e.querySelectorAll('div'+highlighter.selector)
                countdownToCallback.count+=a.length
                for(i=0;i<a.length;i++)(e=>{
                    syntaxHighlighter[highlighter.functionName](e.textContent,(err,res)=>{
                        e.innerHTML=res
                        if(!e.classList.contains('bordered'))
                            e.style.visibility=''
                        countdownToCallback()
                    })
                })(a[i])
                countdownToCallback()
            })()
            ;(()=>{
                var a,i
                a=e.querySelectorAll('script'+highlighter.selector)
                countdownToCallback.count+=a.length
                for(i=0;i<a.length;i++)(e=>{
                    syntaxHighlighter[highlighter.functionName](e.innerHTML,(err,res)=>{
                        e.innerHTML=res
                        if(!e.classList.contains('bordered'))
                            replaceByDiv(e)
                        countdownToCallback()
                    })
                })(a[i])
                countdownToCallback()
            })()
        })
    })
    countdownToCallback()
    function countdownToCallback(){
        if(--countdownToCallback.count)
            return
        cb&&cb(null)
    }
}
function border_all(e,cb){
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
    cb&&cb(null)
}
function replaceByDiv(e){
    var div=document.createElement('div'),i
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
    var result=''
    list.forEach(item=>{
        if(typeof item=='string')
            result+=syntaxHighlighter.htmltextencode(item)
        if(typeof item=='object'){
            result+=`<span class=${item.syntaxName}>${
                highlight(item.list)
            }</span>`
        }
    })
    return result
}
function Syntax(syntaxName,list){
    this.syntaxName=syntaxName
    this.list=list||[]
}
function Database(name){
    Cache.call(this,(key,cb)=>{
        get(`${name}/${key}.json`,(err,res)=>{
            this.data[key]=JSON.parse(res)
            cb(null)
        })
    })
    this.data={}
}
Database.prototype=Object.create(Cache.prototype)
function Cache(load){
    this.load=load
    this.status={}
    this.onLoad={}
}
Cache.prototype.require=function(key,cb){
    if(key instanceof Array){
        (countdownToCb=>{
            key.forEach(key=>{
                this.require(key,()=>{
                    countdownCb()
                })
            })
            countdownCb()
            function countdownCb(){
                if(--countdownToCb)
                    return
                cb(null)
            }
        })(key.length+1)
        return
    }
    if(!this.status[key]){
        this.status[key]=1
        this.onLoad[key]=[]
        this.load(key,err=>{
            if(err)
                return
            this.status[key]=2
            this.onLoad[key].forEach(cb=>{
                cb(null)
            })
        })
    }
    if(this.status[key]==1){
        this.onLoad[key].push(cb)
        return
    }
    cb(null)
}
})()
