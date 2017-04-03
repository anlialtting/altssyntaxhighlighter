;(async()=>{
    if(!module.repository.althea)
        module.repository.althea=(await module.importByPath('https://cdn.rawgit.com/anliting/althea/5c49592c8779c5f5387345a3d4da25a5de55fb26/src/AltheaServer/HttpServer/files/lib/repository.js',{mode:1})).althea
    module.repository.Syntax=module.shareImport('highlighter/Syntax.js')
    let[
        dom,
        html,
        Syntax,
        analyze,
        highlight_all,
        border_all,
        newlineDeletedAnalyze,
    ]=await Promise.all([
        module.repository.althea.dom,
        module.repository.althea.html,
        module.repository.Syntax,
        module.shareImport('highlighter/analyze.js'),
        module.shareImport('highlighter/highlight_all.js'),
        module.shareImport('highlighter/border_all.js'),
        module.shareImport('highlighter/newlineDeletedAnalyze.js'),
    ])
    let
        options=window.syntaxHighlighter
    loadCSS('highlighter.css')
    syntaxHighlighter.modules=new Cache(evalScript)
    syntaxHighlighter.Database=Database
    syntaxHighlighter.analyze=analyze
    syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze
    syntaxHighlighter.highlight=highlight
    syntaxHighlighter.highlight_all=highlight_all
    syntaxHighlighter.border_all=border_all
    async function syntaxHighlighter(){
        await this.highlight_all()
        await this.border_all()
    }
    async function evalScript(path){
        return eval(await module.get(path))
    }
    async function loadCSS(path){
        dom(document.head,
            dom('style',{innerHTML:await module.get(path)})
        )
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
