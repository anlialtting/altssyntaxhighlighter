(()=>{
var
    directoryOfThisScript=
        document.currentScript.src.replace(/[^\/]*$/,''),
    modules=new Cache(evalScript)
window.syntaxHighlighter={
    Database,
    htmltextencode,
    get_token,
    highlight_all,
    border_all
}
function get(path,callback){
    var request=new XMLHttpRequest
    request.onreadystatechange=()=>{
        if(request.readyState===4&&request.status===200){
            callback&&callback(null,request.responseText)
        }
    }
    request.open('GET',directoryOfThisScript+path)
    request.send()
}
function evalScript(path,callback){
    var request=new XMLHttpRequest
    request.onreadystatechange=()=>{
        if(request.readyState===4&&request.status===200){
            eval(request.responseText)
            callback&&callback(null)
        }
    }
    request.open('GET',directoryOfThisScript+path)
    request.send()
}
function htmltextencode(s){
    var e=document.createElement('div')
    e.textContent=s
    return e.innerHTML
}
function get_token(i,regex_first,regex){
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
    s=splitSourceByNewlineCharacter(s)
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
    modules.require('highlightCpp.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_cpp')
        countdownToCallback.count+=a.length
        for(i=0;i<a.length;i++)(e=>{
            syntaxHighlighter.highlightCpp(e.textContent,(err,res)=>{
                e.innerHTML=res
                if(!e.classList.contains('bordered'))
                    e.style.visibility=''
                countdownToCallback()
            })
        })(a[i])
        countdownToCallback()
    })
    modules.require('langHtml.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_html')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_html(
                a[i].textContent
            )
            a[i].style.visibility=''
        }
        countdownToCallback()
    })
    modules.require('langJs.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_js')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_js(
                a[i].textContent
            )
            a[i].style.visibility=''
        }
        countdownToCallback()
    })
    modules.require('langPhp.js',()=>{
        var a,i
        a=e.getElementsByClassName('highlighted_php')
        for(i=0;i<a.length;i++){
            a[i].innerHTML=syntaxHighlighter.highlight_php(
                a[i].textContent
            )
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
                this.require(key,key=>{
                    if(--countdownToCb)
                        return
                    cb(null)
                })
            })
        })(key.length)
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
