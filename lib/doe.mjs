function doe(n){
    let
        state=0,
        p={
            function:f=>f(n),
            number,
            object,
            string,
        }
    transform([...arguments].slice(1))
    return n
    function number(n){
        state=n
    }
    function object(o){
        if(o instanceof Array)
            array()
        else if(o instanceof Node)
            n[state?'removeChild':'appendChild'](o)
        else if(('length' in o)||o[Symbol.iterator]){
            o=Array.from(o)
            array()
        }else if(state)
            Object.entries(o).map(([a,b])=>n.setAttribute(a,b))
        else
            Object.assign(n,o)
        function array(){
            o.map(transform)
        }
    }
    function string(s){
        n.appendChild(document.createTextNode(s))
    }
    function transform(t){
        for(let q;q=p[typeof t];t=q(t));
    }
}
let methods={
    html(){
        return doe(document.documentElement,...arguments)
    },
    head(){
        return doe(document.head,...arguments)
    },
    body(){
        return doe(document.body,...arguments)
    },
}
export default new Proxy(doe,{
    get:(t,p)=>methods[p]||function(){
        return doe(document.createElement(p),...arguments)
    }
})
