function doe(n){
    let
        state=0,
        p={
            function:f=>f(n),
            number,
            object,
            string,
        };
    transform([...arguments].slice(1));
    return n
    function number(n){
        state=n;
    }
    function object(o){
        if(o instanceof Array)
            array();
        else if(o instanceof Node)
            n[state?'removeChild':'appendChild'](o);
        else if(('length' in o)||o[Symbol.iterator]){
            o=Array.from(o);
            array();
        }else if(state)
            Object.entries(o).map(([a,b])=>n.setAttribute(a,b));
        else
            Object.assign(n,o);
        function array(){
            o.map(transform);
        }
    }
    function string(s){
        n.appendChild(document.createTextNode(s));
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
};
var doe$1 = new Proxy(doe,{
    get:(t,p)=>methods[p]||function(){
        return doe(document.createElement(p),...arguments)
    }
})

/*
    font-weight:bold; 總是要加上 line-height:0px; 忘記原因了
*/
var style = `
.typeset{
    word-break:break-all;
}
.typeset.table{
    display:table;
    table-layout:fixed;
    width:100%;
    font-family:monospace;
    text-align:left;
}
.typeset .tableRow{
    display:table-row;
}
.typeset .lineNumber::before{
    content:attr(data-line-number);
}
.typeset .lineNumber{
    display:table-cell;
    text-align:right;
    color:gray;
    vertical-align:top;
    height:12pt;
    white-space:nowrap;
}
.typeset .content{
    display:table-cell;
    padding-left:16px;
    white-space:pre-wrap;
    word-wrap:break-word;
}
.highlighted_cpp{
    tab-size:4;
    font-family:monospace;
}
.highlighted_cpp span.deletedNewline{
    font-weight:normal;
    color:black;
}
.highlighted_cpp span.characterLiteral{
    color:blue;
}
.highlighted_cpp span.comment{
    color:gray;
}
.highlighted_cpp span.rawStringLiteral{
    color:blue;
}
.highlighted_cpp span.cStringLiteral{
    color:blue;
}
.highlighted_cpp span.numberLiteral{
    color:darkviolet;
}
.highlighted_cpp span.operator{
    color:red;
}
.highlighted_cpp span.preprocessingDirective{
    color:green;
}
.highlighted_cpp span.headerName{
    color:darkred;
}
.highlighted_cpp span.headerNameSlash{
    color:darkblue;
}
.highlighted_cpp span.definePDKeyValue{
    color:darkred;
}
.highlighted_cpp span.definePDValue{
    color:darkblue;
}
.highlighted_cpp span.definePDValue span.operator{
    color:darkblue;
}
.highlighted_cpp span.keywords{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_cpp span.library{
    color:deeppink;
}
.highlighted_cpp span.stlcontainers{
    color:green;
    font-weight:bold;
    line-height:0px;
}
.highlighted_cpp span.constants{
    color:darkviolet;
    font-weight:bold;
    line-height:0px;
}
.highlighted_html{
    font-family:monospace;
}
.highlighted_html span.startTag{
    color:green;
}
.highlighted_html span.tagname{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_html span.attribute{
    color:deeppink;
}
.highlighted_html span.afterEqualInAttribute{
    color:green;
}
.highlighted_html span.attributeValue{
    color:blue;
}
.highlighted_html span.endTag{
    color:green;
}
.highlighted_html span.comment{
    color:gray;
}
.highlighted_js{
    font-family:monospace;
}
.highlighted_js span.comment{
    color:gray;
}
.highlighted_js span.string{
    color:blue;
}
.highlighted_js span.number{
    color:darkviolet;
}
.highlighted_js span.keyword{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_js span.operator{
    color:red;
}
.highlighted_js span.templateStringPlaceHolder{
    color:black;
}
.highlighted_tex{
    font-family:monospace;
}
.highlighted_tex span.comment{
    color:gray;
}
.highlighted_tex span.operator{
    color:red;
}
.highlighted_tex span.coreCommands{
    color:blue;
}
.highlighted_tex span.documentClasses{
    color:green;
}
.highlighted_tex span.commonArguments{
    color:green;
}
.highlighted_tex span.commonPackages{
    color:green;
}
`

function Syntax(syntaxName,list){
    this.syntaxName=syntaxName;
    this.list=list||[];
}

function analyze(matchingRules,source){
    let result=[];
    while(
        match(result)||
        matchSingleCharcter(result)
    );
    return result
    function match(result){
        for(let syntaxName in matchingRules)
            if(matchBySyntaxName(syntaxName,result,true))
                return true
    }
    function matchBySyntaxName(syntaxName,result,root=false){
        if(matchingRules[syntaxName] instanceof Array){
            for(let i=0;i<matchingRules[syntaxName].length;i++)
                if(matchByRule(
                    syntaxName,
                    matchingRules[syntaxName][i],
                    result,
                    root
                ))
                    return true
            return
        }
        return matchByRule(
            syntaxName,
            matchingRules[syntaxName],
            result,
            root
        )
    }
    function matchByRule(syntaxName,rule,result,root){
        if(!(
            root?rule.root:1
        ))
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
        for(let i=0;i<keywords.length;i++)
            if(source.substring(0,keywords[i].length)==keywords[i]){
                result.push(new Syntax(syntaxName,[keywords[i]]));
                source=source.substring(keywords[i].length);
                return true
            }
    }
    function matchSyntaxByRegex(
        syntaxName,
        regex,
        containKeywords,
        result
    ){
        if(!regex.test(source))
            return
        let match=source.match(regex)[1];
        source=source.substring(match.length);
        let syntax=new Syntax(syntaxName);
        containKeywords&&submatch()||
        syntax.list.push(match);
        result.push(syntax);
        return true
        function submatch(){
            for(let i=0;i<containKeywords.length;i++){
                let keywords=matchingRules[containKeywords[i]].keywords;
                if(keywords.indexOf(match)!=-1){
                    syntax.list.push(
                        new Syntax(containKeywords[i],[match])
                    );
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
        if(!headRegex.test(source))
            return
        let syntax=new Syntax(syntaxName);
        simpleMatch(headRegex,syntax.list);
        while(!source.match(tailRegex)&&(
            contain&&submatch()||
            matchSingleCharcter(syntax.list)
        ));
        simpleMatch(tailRegex,syntax.list);
        result.push(syntax);
        return true
        function submatch(){
            var i;
            for(i=0;i<contain.length;i++)
                if(matchBySyntaxName(contain[i],syntax.list))
                    return true
        }
        function simpleMatch(regex,result){
            var match;
            try{
                match=source.match(regex)[1];
                syntax.list.push(match);
                source=source.substring(match.length);
            }catch(e){
                console.log(source,regex,source.match(regex));
                throw''
            }
        }
    }
    function matchSingleCharcter(result){
        if(!source.length)
            return
        result.push(source[0]);
        source=source.substring(1);
        return true
    }
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
    source=analyze(matchingRules,a.join(''));
    a=a.map(s=>s.length);
    a.pop();
    dfs(source,result,a);
    return result
}
function dfs(source,result,a){
    while(source.length){
        if(typeof source[0]=='string'){
            if(a.length==0){
                result.push(source[0]);
                source.shift();
            }else{
                if(a[0]<source[0].length){
                    result.push(source[0].substring(0,a[0]));
                    result.push(new Syntax(
                        'deletedNewline',
                        ['\\\n']
                    ));
                    source[0]=source[0].substring(a[0]);
                    a.shift();
                }else{
                    result.push(source[0]);
                    a[0]-=source[0].length;
                    source.shift();
                }
            }
            continue
        }
        if(typeof source[0]=='object')(()=>{
            var list=[];
            dfs(source[0].list,list,a);
            result.push(new Syntax(source[0].syntaxName,list));
            source.shift();
        })();
    }
    while(a.length&&a[0]==0){
        result.push(new Syntax('deletedNewline',['\\\n']));
        a.shift();
    }
}

/*
Represent every character as character reference. This can be used to
represent text in the <template> elements, escapable raw text elements,
foreign elements, and normal elements. Note that it does not include raw
text elements.
https://www.w3.org/TR/2017/REC-html52-20171214/syntax.html#writing-html-documents-elements
*/
function escape(s){
    let x='';
    for(let i=0;i<s.length;i++)
        x+=`&#${s.charCodeAt(i)};`;
    return x
}

function highlight(list){
    return list.map(item=>{
        if(typeof item=='string')
            return escape(item)
        else if(typeof item=='object')
            return `<span class=${item.syntaxName}>${
                highlight(item.list)
            }</span>`
    }).join('')
}

/*
    `keywords` contains `Keywords` and `Alternative representations`.
    Standard: N3242 2.13.
    Compelete.
*/
var keywords = [
    // Keywords
    'alignas','alignof','asm','auto','bool','break','case','catch','char','char16_t','char32_t','class','const','constexpr','const_cast','continue','default','delete','double','do','dynamic_cast','else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','nullptr','operator','private','protected','public','register','reinterpret_cast','return','short','signed','sizeof','static','static_assert','static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned','using','virtual','void','volatile','wchar_t','while',
    // Alternative representations
    'and','and_eq','bitand','bitor','compl','not','not_eq','or','or_eq','xor','xor_eq',
]

/*
    `stringset_library` contains the following:
    Algorithms library - Non-modifying sequence operations
    Algorithms library - Modifying sequence operations
    Algorithms library - Sorting and related operations
    Algorithms library - C library algorithms
    Numerics library - Floating-Point Environment
    Numerics library - Complex numbers
    Numerics library - Random number generation
    Standard: N3242 25, 26.
    Algorithm Compelete.
*/
var library = [
    // Algorithms library - Non-modifying sequence operations
    'all_of','any_of','none_of','for_each','find','find_if','find_if_not','find_end','find_first_of','adjacent_find','count','count_if','mismatch','equal','is_permutation','search','search_n',
    // Algorithms library - Modifying sequence operations
    'copy','copy_n','copy_if','copy_backward','move','move_backward','swap_ranges','iter_swap','transform','replace','replace_if','replace_copy','replace_copy_if','fill','fill_n','generate','generate_n','remove','remove_if','remove_copy','remove_copy_if','unique','unique_copy','reverse','reverse_copy','rotate','rotate_copy','random_shuffle','is_partitioned','partition','stable_partition','partition_copy','partition_point',
    // Algorithms library - Sorting and related operations
    'sort','stable_sort','partial_sort','partial_sort_copy','is_sorted','is_sorted_until','nth_element','lower_bound','upper_bound','equal_range','binary_search','merge','inplace_merge','includes','set_union','set_intersection','set_difference','set_symmetric_difference','push_heap','pop_heap','make_heap','sort_heap','is_heap','is_heap_until','min','max','minmax','min_element','max_element','minmax_element','lexicographical_compare','next_permutation','prev_permutation',// Algorithms library - C library algorithms
    'bsearch','qsort',
    // Numerics library - Floating-Point Environment
    'feclearexcept','fegetexceptflag','feraiseexcept','fesetexceptflag','fetestexcept','fegetround','fesetround','fegetenv','feholdexcept','fesetenv','feupdateenv',
    // Numerics library - Complex numbers
    'complex','real','imag','abs','arg','norm','conj','proj','polar','acos','asin','atan','acosh','asinh','atanh','cos','cosh','exp','log','log10','pow','sin','sinh','sqrt','tan','tanh',
    // Numerics library - Random number generation
    'linear_congruential_engine','mersenne_twister_engine','subtract_with_carry_engine','discard_block_engine','independent_bits_engine','shuffle_order_engine','minstd_rand0','minstd_rand','mt19937','mt19937_64','ranlux24_base','ranlux48_base','ranlux24','ranlux48','knuth_b','default_random_engine','random_device','seed_seq','RealType generate_canonical(URNG& g)','uniform_int_distribution','uniform_real_distribution','bernoulli_distribution','binomial_distribution','geometric_distribution','negative_binomial_distribution','poisson_distribution','exponential_distribution','gamma_distribution','weibull_distribution','extreme_value_distribution','normal_distribution','lognormal_distribution','chi_squared_distribution','cauchy_distribution','fisher_f_distribution','student_t_distribution','discrete_distribution','piecewise_constant_distribution','piecewise_linear_distribution',
    //
    'accumulate','adjacent_difference','advance','back','begin','chdir','chroot','cin','copy','copy','count','count_if','cout','distance','empty','end','endl','equal_range','execl','exit','fclose','fflush','fgets','FILE','fill','first','fopen','for_each','fork','fprintf','fputc','fputs','fputs','freopen','front','fscanf','getchar','getpagesize','gets','inner_product','int16_t','int32_t','int64_t','int8_t','uint16_t','uint32_t','uint64_t','uint8_t','ios_base','islower','isupper','iterator','kill','malloc','max','max_element','memset','min','min_element','nice','partial_sum','pclose','pop','popen','printf','ptrace','push','push_back','puts','random_shuffle','remove','reverse','scanf','second','setvbuf','size','sort','sprintf','sscanf','std','stdin','stdout','strcat','strcmp','strcpy','strlen','strncmp','swap','sync_with_stdio','top','unique','plus','equal','is_permutation','search','search_n','memcpy','log2','log10','log','exp','pow','round','floor','ceil','sqrt','clock','clock_t','erase','insert','plus','minus','multiplies','divides','modulus','negate','less','greater',
]

var stlcontainers = [
    'array','bitset','deque','forward_list','list','map','multimap','multiset','pair','priority_queue','queue','set','stack','string','unordered_map','unordered_set','valarray','vector',
]

var constants = [
    // Numerics library - Floating-Point Environment
    'FE_ALL_EXCEPT','FE_DIVBYZERO','FE_INEXACT','FE_INVALID','FE_OVERFLOW','FE_UNDERFLOW','FE_DOWNWARD','FE_TONEAREST','FE_TOWARDZERO','FE_UPWARD','FE_DFL_ENV',
    //
    'EOF','EXIT_FAILURE','EXIT_SUCCESS','INFINITY','INT_MAX','INT_MIN','LONG_MAX','LONG_MIN','NULL',
]

var
    matchingRules={
        characterLiteral:{
            root:1,
            regex:/^('(?:[^'\\]|\\.)')/,
        },
        comment:[
            {
                root:1,
                regex:/^(\/\/.*)\n/,
            },{
                root:1,
                regex:/^(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/,
            }
        ],
        rawStringLiteral:{
            root:1,
            regex:/^(R"([^\ \(\)\\]{0,16})\((?:(?!\)\2")(?:.|\n))*\)\2")/,
        },
        cStringLiteral:{
            root:1,
            regex:/^("(?:[^"\\]|\\.)*")/,
        },
        identifier:{
            root:1,
            regex:/^([A-Z_a-z][0-9A-Z_a-z]*)/,
            containKeywords:[
                'keywords',
                'library',
                'stlcontainers',
                'constants',
            ]
        },
        numberLiteral:{
            root:1,
            regex:/^([0-9][0-9ELXelx.]*)/,
        },
        operator:{
            root:1,
            regex:/^([()\[\]{}<>+\-*\/%,:;?&^=!~.|])/,
        },
        preprocessingDirective:{
            root:1,
            headRegex:/^(#)/,
            tailRegex:/^()\n/,
            contain:['comment','includePD','definePD'],
        },
        includePD:{
            headRegex:/^(include)/,
            tailRegex:/^()\n/,
            contain:['comment','headerName'],
        },
        headerName:[
            {
                headRegex:/^(<)/,
                tailRegex:/^(>)/,
                contain:['headerNameSlash'],
            },{
                headRegex:/^(")/,
                tailRegex:/^(")/,
                contain:['headerNameSlash'],
            },
        ],
        headerNameSlash:{
            regex:/^(\/)/
        },
        definePD:{
            headRegex:/^(define)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDKeyValue'],
        },
        definePDKeyValue:{
            headRegex:/^([A-Z_a-z]+(?:\([^\)]*\))?)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDValue'],
        },
        definePDValue:{
            headRegex:/^(.)/,
            tailRegex:/^()\n/,
            contain:['comment','operator'],
        },
        keywords:{
        },
        library:{
        },
        stlcontainers:{
        },
        constants:{
        },
    };
matchingRules.keywords.keywords=keywords;
matchingRules.library.keywords=library;
matchingRules.stlcontainers.keywords=stlcontainers;
matchingRules.constants.keywords=constants;
function highlightCpp(source){
    return highlight(newlineDeletedAnalyze(matchingRules,source))
}

var
    matchingRules$1={
        startTag:{
            root:1,
            headRegex:/^()<[a-z]/,
            tailRegex:/^(\>)/,
            contain:['headOfStartTag','attribute']
        },
        headOfStartTag:{
            headRegex:/^()<[a-z]/,
            tailRegex:/^()[\ \>\n]/,
            contain:['tagname']
        },
        tagname:{
            regex:/^([-A-Za-z]+)/,
        },
        attribute:{
            headRegex:/^([-A-Za-z]+)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['afterEqualInAttribute']
        },
        afterEqualInAttribute:{
            headRegex:/^(=)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['attributeValue'],
        },
        attributeValue:[{
            headRegex:/^(')/,
            tailRegex:/^(')/,
        },{
            headRegex:/^(")/,
            tailRegex:/^(")/,
        },{
            headRegex:/^()/,
            tailRegex:/^()[\ \>\n]/,
        }],
        endTag:{
            root:1,
            headRegex:/^(<\/)/,
            tailRegex:/^(\>)/,
            contain:['tagname'],
        },
        comment:[
            {
                root:1,
                regex:/^(\<!--(?:(?!--\>)(?:.|\n))*--\>)/,
            },{
                root:1,
                regex:/^(\<![^\>]*\>)/,
            }
        ],
    };
function highlightHtml(source){
    return highlight(analyze(matchingRules$1,source))
}

/*
The following keywords are listed on:
http://www.ecma-international.org/ecma-262/8.0/index.html#sec-keywords
*/
var keyword = [
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
]

var library$1 = [
    'alert',
]

let matchingRules$2={
    comment:[
        {
            root:1,
            regex:/^(\/\/.*\n)/,
        },{
            root:1,
            regex:/^(\/\*(?:.|\n)*\*\/)/,
        }
    ],
    string:[
        {
            root:1,
            regex:/^('(?:[^'\\]|\\.)*')/,
        },{
            root:1,
            regex:/^("(?:[^"\\]|\\.)*")/,
        },{
            root:1,
            headRegex:/^(`)/,
            tailRegex:/^(`)/,
            contain:['templateStringPlaceHolder'],
        }
    ],
    operator:{
        root:1,
        regex:/^([!%&\(\)\*\+\,\-\.\/\:;\<=\>\?\[\]\^\{\|\}\~])/,
    },
    number:{
        root:1,
        regex:/^([0-9]+(?:\.[0-9]+)?)/
    },
    identifier:{
        root:1,
        regex:/^([A-Z_a-z]+)/,
        containKeywords:[
            'keyword',
            'library',
        ]
    },
    keyword:{
    },
    library:{
    },
    templateStringPlaceHolder:{
        headRegex:/^(\${)/,
        tailRegex:/^(})/,
    },
};
matchingRules$2.keyword.keywords=keyword;
matchingRules$2.library.keywords=library$1;
function highlightJs(source){
    return highlight(analyze(matchingRules$2,source))
}

var coreCommands = [
    'documentclass',
    'usepackage',
    'documentstyle',
    'title',
    'author',
    'date',
    'pagestyle',
    'thispagestyle',
    'begin',
    'end'
]

var documentClasses = [
    'article',
    'report',
    'book',
    'letter',
    'slides'
]

var commonArguments = [
    'document',
]

var commonPackages = [
    'fontspec',
]

var
    matchingRules$3={
        comment:{
            root:1,
            regex:/^(%.*\n)/,
        },
        command:{
            root:1,
            headRegex:/^()\\/,
            tailRegex:/^()[^\\a-z]/,
            contain:['operator','commandName'],
        },
        operator:{
            root:1,
            regex:/^([\\\[\]\{\}])/,
        },
        identifier:{
            root:1,
            regex:/^([a-z]+)/,
            containKeywords:[
                'documentClasses',
                'commonArguments',
                'commonPackages',
            ],
        },
        commandName:{
            regex:/^([a-z]+)/,
            containKeywords:['coreCommands'],
        },
        coreCommands:{
        },
        documentClasses:{
        },
        commonArguments:{
        },
        commonPackages:{
        },
    };
matchingRules$3.coreCommands.keywords=coreCommands;
matchingRules$3.documentClasses.keywords=documentClasses;
matchingRules$3.commonArguments.keywords=commonArguments;
matchingRules$3.commonPackages.keywords=commonPackages;
function highlightTex(source){
    return highlight(analyze(matchingRules$3,source))
}

function text_border(s){
    let
        countOfLines,
        logCountOfLines;
    s=splitSourceByNewlineCharacter(s);
    countOfLines=s.replace(/&#10;/g,'\n').split('\n').length-1;
    logCountOfLines=Math.floor(Math.round(
        Math.log(countOfLines)/Math.log(10)*1e6
    )/1e6);
    return table()
    function splitSourceByNewlineCharacter(source){
        return splitElementByNewlineCharacter(
            doe$1.div({innerHTML:source})
        )
    }
    function splitElementByNewlineCharacter(e){
        return[...e.childNodes].map(node=>
            node.nodeType==Node.TEXT_NODE?
                escape(node.wholeText)
            :
                splitElementByNewlineCharacter(
                    node
                ).replace(/&#10;/g,'\n').split('\n').map(s=>(
                    node.innerHTML=s,
                    node.outerHTML
                )).join('\n')
        ).join('')
    }
    function table(){
        let lines=s.replace(/&#10;/g,'\n').split('\n');
        lines.pop();
        return doe$1.div({className:'typeset table'},
            lines.map(s=>s+'\n').map((e,i)=>
                tr(i,e)
            )
        )
    }
    function tr(i,s){
        return doe$1.div({className:'tableRow'},
            tr=>{tr.dataset.lineNumber=i+1;},
            td_lineNumber(i),
            doe$1.div({className:'content',innerHTML:s})
        )
    }
    function td_lineNumber(i){
        return doe$1.div({className:'lineNumber'},td=>{
            td.dataset.lineNumber=i+1;
            td.style.width=6*(logCountOfLines+1)+'pt';
        })
    }
}

let languages={
    cpp: highlightCpp,
    html: highlightHtml,
    js: highlightJs,
    tex: highlightTex,
};
function Highlighted(lang,s){
    this.lang=lang;
    this.s=s;
}
Highlighted.prototype.toString=function(){
    return`<span class=highlighted_${this.lang}>${
        languages[this.lang](this.s)
    }</span>`
};
Highlighted.prototype.typeset=function(){
    return text_border(this.toString())
};
function highlight$1(k,s){
    return new Highlighted(k,s)
}
var highlight$2 = new Proxy(highlight$1,{get:(t,k)=>
    s=>new Highlighted(k,s)
})

var main = {
    highlight: highlight$2,
    typeset: text_border,
    style,
}

export default main;
export { highlight$2 as highlight, text_border as typeset, style };
