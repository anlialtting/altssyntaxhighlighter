(()=>{
window.syntaxHighlighter={
    htmltextencode,
    htmltextdecode,
    contain,
    get_token,
    getToken,
    highlight_all,
    border_all
}
evalScript.directoryOfThisScript=
    document.currentScript.src.replace(/[^\/]*$/,'')
function evalScript(path,callback){
    var request=new XMLHttpRequest
    request.onreadystatechange=()=>{
        if(request.readyState===4&&request.status===200){
            eval(request.responseText)
            callback&&callback(null)
        }
    }
    request.open('GET',evalScript.directoryOfThisScript+path)
    request.send()
}
function evalScripts(paths,callback){
    var countdownToCallback
    countdownToCallback=paths.length
    paths.forEach(path=>{
        evalScript(path,()=>{
            if(--countdownToCallback)
                return
            callback&&callback(null)
        })
    })
}
function requireScript(path,callback){
    requireScript.loadedScripts=requireScript.loadedScripts||{}
    if(requireScript.loadedScripts[path])
        return callback(null)
    evalScript(path,callback)
}
function requireScripts(path,callback){
    var countdownToCallback
    countdownToCallback=paths.length
    paths.forEach(path=>{
        requireScript(path,()=>{
            if(--countdownToCallback)
                return
            callback&&callback(null)
        })
    })
}
function htmltextencode(s){
    var e=document.createElement('div')
    e.appendChild(document.createTextNode(s))
    return e.innerHTML
}
function htmltextdecode(s){
    var e=document.createElement('div')
    e.innerHTML=s
    return e.firstChild.data
}
function contain(key){
    var bound=this.indexOf(key)
    return bound!=-1&&this[bound]==key
}
function get_token(i,regex_first,regex){
    if(regex_first.test(this[i])){
        i++
        while(i<this.length&&regex.test(this[i]))
            i++
    }
    return i
}
function getToken(s,regex_first,regex){
    if(regex_first.test(this[i])){
        i++
        while(i<this.length&&regex.test(this[i]))
            i++
    }
    return i
}
function text_border(s){
    var
        countOfLines,
        logCountOfLines
    countOfLines=s.split('\n').length-1
    logCountOfLines=Math.floor(Math.round(
        Math.log(countOfLines)/Math.log(10)*1e6
    )/1e6)
    return`
        <div style="position:relative;">
            <div>
                ${table(true).outerHTML}
            </div>
            <div style="position:absolute;top:0px;">
                ${table(false).outerHTML}
            </div>
        </div>
    `
    function table(isShowLineNumbers){
        var
            table,
            lines
        table=document.createElement('table')
        lines=s.split('\n')
        lines.pop()
        lines.forEach((e,i)=>{
            table.appendChild(tr(i,e,isShowLineNumbers))
        })
        return table
    }
    function tr(i,s,isShowLineNumbers){
        var
            tr
        tr=document.createElement('tr')
        tr.appendChild(td_lineNumber(i,isShowLineNumbers))
        tr.appendChild(td_content(s,isShowLineNumbers))
        return tr
    }
    function td_lineNumber(i,isShowLineNumbers){
        var
            td
        td=document.createElement('td')
        td.className='lineNumber'
        td.style.width=6*(logCountOfLines+1)+'pt'
        if(isShowLineNumbers)
            td.textContent=i+1
        return td
    }
    function td_content(s,isShowLineNumbers){
        var
            td
        td=document.createElement('td')
        td.className='content'
        td.innerHTML=isShowLineNumbers?
            '<span style="visibility:hidden;">'+s+'</span>'
        :
            s
        return td
    }
}
function highlight_all(e,cb){
    e=e||document
    countdownToCallback.count=4
    requireScript('highlightCpp.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_cpp')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlightCpp(a[i].textContent)
            a[i].style.visibility=''
        }
        countdownToCallback()
    })
    requireScript('langHtml.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_html')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_html(a[i].textContent)
            a[i].style.visibility=''
        }
        countdownToCallback()
    })
    requireScript('langJs.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_js')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_js(a[i].textContent)
            a[i].style.visibility=''
        }
        countdownToCallback()
    })
    requireScript('langPhp.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_php')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_php(a[i].textContent)
            a[i].style.visibility=''
        }
    })
    countdownToCallback()
    function countdownToCallback(){
        if(--countdownToCallback.count)
            return
        cb&&cb(null)
    }
}
function border_all(e,cb){
    var a,i
    e=e||document
    a=e.getElementsByClassName('bordered')
    for(i=0;i<a.length;i++){
        a[i].innerHTML=text_border(a[i].innerHTML)
        a[i].style.visibility=''
    }
    cb&&cb(null)
}
})()
