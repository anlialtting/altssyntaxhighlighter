import analyze from './analyze.mjs'
import Syntax from './Syntax.mjs'
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
    dfs(source,result,a)
    return result
}
function dfs(source,result,a){
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
            dfs(source[0].list,list,a)
            result.push(new Syntax(source[0].syntaxName,list))
            source.shift()
        })()
    }
    while(a.length&&a[0]==0){
        result.push(new Syntax('deletedNewline',['\\\n']))
        a.shift()
    }
}
export default newlineDeletedAnalyze
