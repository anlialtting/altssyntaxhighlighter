(()=>{
/*
    `stringset_keywords` contains `Keywords` and `Alternative representations`.
    Standard: N3242 2.13.
    Compelete.
*/
var stringset_keywords=[
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
var stringset_library=[
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
var stringset_stlcontainers=[
    'array','bitset','deque','forward_list','list','map','multimap','multiset','pair','priority_queue','queue','set','stack','string','unordered_map','unordered_set','valarray','vector',
]
var stringset_constants=[
    // Numerics library - Floating-Point Environment
    'FE_ALL_EXCEPT','FE_DIVBYZERO','FE_INEXACT','FE_INVALID','FE_OVERFLOW','FE_UNDERFLOW','FE_DOWNWARD','FE_TONEAREST','FE_TOWARDZERO','FE_UPWARD','FE_DFL_ENV',
    //
    'EOF','EXIT_FAILURE','EXIT_SUCCESS','INFINITY','INT_MAX','INT_MIN','LONG_MAX','LONG_MIN','NULL',
]
var regexOfOperators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/
var regexOfSpecifier=/^[A-Za-z_][0-9A-Za-z_]*/
var regexOfNumberLiteral=/^[0-9][0-9ELXelx.]*/
window.syntaxHighlighter.highlightCpp=highlightCpp
function highlightCpp(code){
    var
        input,
        output
    input=code
    output=''
    highlightCppCode()
    return output
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
        if(stringset_keywords.indexOf(token)!=-1)
            output+='<span class="keywords">'+token+'</span>'
        else if(stringset_library.indexOf(token)!=-1)
            output+='<span class="library">'+token+'</span>'
        else if(stringset_stlcontainers.indexOf(token)!=-1)
            output+='<span class="stlcontainers">'+token+'</span>'
        else if(stringset_constants.indexOf(token)!=-1)
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
            return false
        highlightSingleCharacter()
        return true
    }
    function highlightSingleCharacter(){
        output+=syntaxHighlighter.htmltextencode(input[0])
        input=input.substring(1)
    }
    function tryHighlightPreprocessorInstruction(){
        if(input[0]!='#')
            return false
        highlightPreprocessorInstruction()
        return true
    }
    function highlightPreprocessorInstruction(){
        output+='<span class="preprocessorInstruction">'
        while(input[0]!='\n'&&(
            tryHighlightSingleLineComment()||
            tryHighlightMultiLineComment()||
            tryHighlightIgnoredNewlineCharacter()||
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        ));
        output+='</span>'
    }
    function tryHighlightSingleLineComment(){
        if(input.substring(0,2)!='//')
            return false
        highlightSingleLineComment()
        return true
    }
    function highlightSingleLineComment(){
        output+='<span class="singleLineComment">'
        while(input[0]!='\n'&&(
            tryHighlightIgnoredNewlineCharacter()||
            tryDehighlightNewlineCharacter()||
            tryHighlightSingleCharacter()
        ));
        output+='</span>'
    }
    function tryHighlightMultiLineComment(){
        if(input.substring(0,2)!='/*')
            return false
        highlightMultiLineComment()
        return true
    }
    function highlightMultiLineComment(){
        output+='<span class="multiLineComment">'
        while(input.length){
            if(input.substring(0,2)=='*/'){
                output+=syntaxHighlighter.htmltextencode(input.substring(0,2))
                input=input.substring(2)
                break
            }
            if(
                tryDehighlightNewlineCharacter()||
                tryHighlightSingleCharacter()
            )
                continue
        }
        output+='</span>'
    }
    function tryHighlightBlackslashInLiteral(){
        if(input[0]!='\\')
            return false
        highlightBlackslashInLiteral()
        return true
    }
    function highlightBlackslashInLiteral(){
        highlightSingleCharacter()
        highlightSingleCharacter()
    }
    function tryHighlightCharacterLiteral(){
        if(input[0]!='\'')
            return false
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
            return false
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
            return false
        highlightOperators()
        return true
    }
    function highlightOperators(){
        output+='<span class="operators">'
        output+=syntaxHighlighter.htmltextencode(input[0])
        input=input.substring(1)
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
        dehighlightNewlineCharacter()
    }
    function tryDehighlightNewlineCharacter(){
        if(input[0]!='\n')
            return false
        dehighlightNewlineCharacter()
        return true
    }
    function dehighlightNewlineCharacter(){
        var
            traveler=arguments.callee,
            ancestors=[],
            openers=[]
        while(traveler.name!='highlightCppCode'){
            if(/^highlight/.test(traveler.name))
                ancestors.push(traveler.name)
            traveler=traveler.caller
        }
        output+=ancestors.map(functionName=>{
            if([
                'highlightOperators',
                'highlightNumberLiteral',
                'highlightCharacterLiteral',
                'highlightCStringLiteral',
                'highlightMultiLineComment',
                'highlightSingleLineComment',
                'highlightPreprocessorInstruction',
            ].indexOf(functionName)!=-1)
                return'</span>'
            return''
        }).join('')
        output+=syntaxHighlighter.htmltextencode(input[0])
        input=input.substring(1)
        ancestors.reverse()
        output+=ancestors.map(functionName=>{
            if(functionName=='highlightOperators')
                return'<span class="operators">'
            if(functionName=='highlightNumberLiteral')
                return'<span class="number">'
            if(functionName=='highlightCharacterLiteral')
                return'<span class="characterLiteral">'
            if(functionName=='highlightCStringLiteral')
                return'<span class="cStringLiteral">'
            if(functionName=='highlightMultiLineComment')
                return'<span class="multiLineComment">'
            if(functionName=='highlightSingleLineComment')
                return'<span class="singleLineComment">'
            if(functionName=='highlightPreprocessorInstruction')
                return'<span class="preprocessorInstruction">'
            return''
        }).join('')
    }
}
})()
