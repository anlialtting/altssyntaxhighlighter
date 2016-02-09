(()=>{
window.syntaxHighlighter.highlight_cpp=highlight_cpp
function highlight_cpp(s){
    /*
     * `stringset_keywords` contains `Keywords` and `Alternative representations`.
     * Standard: N3242 2.13.
     * Compelete.
     */
    var stringset_keywords=[
        // Keywords
        'alignas','alignof','asm','auto','bool','break','case','catch','char','char16_t','char32_t','class','const','constexpr','const_cast','continue','default','delete','double','do','dynamic_cast','else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','nullptr','operator','private','protected','public','register','reinterpret_cast','return','short','signed','sizeof','static','static_assert','static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned','using','virtual','void','volatile','wchar_t','while',
        // Alternative representations
        'and','and_eq','bitand','bitor','compl','not','not_eq','or','or_eq','xor','xor_eq',
        ];
    /*
     * `stringset_library` contains following:
     * Algorithms library - Non-modifying sequence operations
     * Algorithms library - Modifying sequence operations
     * Algorithms library - Sorting and related operations
     * Algorithms library - C library algorithms
     * Numerics library - Floating-Point Environment
     * Numerics library - Complex numbers
     * Numerics library - Random number generation
     * Standard: N3242 25, 26.
     * Algorithm Compelete.
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
        ];
    var stringset_stlcontainers=[
        'array','bitset','deque','forward_list','list','map','multimap','multiset','pair','priority_queue','queue','set','stack','string','unordered_map','unordered_set','valarray','vector',
        ];
    var stringset_constants=[
        // Numerics library - Floating-Point Environment
        'FE_ALL_EXCEPT','FE_DIVBYZERO','FE_INEXACT','FE_INVALID','FE_OVERFLOW','FE_UNDERFLOW','FE_DOWNWARD','FE_TONEAREST','FE_TOWARDZERO','FE_UPWARD','FE_DFL_ENV',
        //
        'EOF','EXIT_FAILURE','EXIT_SUCCESS','INFINITY','INT_MAX','INT_MIN','LONG_MAX','LONG_MIN','NULL',
        ];
    var regex_operators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/
    var regex_specifier_characters_first=/[A-Za-z_]/
    var regex_specifier_characters=/[0-9A-Za-z_]/
    var regex_literal_characters_first=/[0-9]/
    var regex_literal_characters=/[0-9ELXelx.]/
    s=syntaxHighlighter.htmltextdecode(s)
    var x=''
    /*
       define values in stack
       0 the problem
       1 backslash
       2 single-row comment
       3 multi-row comment
       4 preprocessor instruction
       5 character literal
       6 string literal
       7 preprocessor instruction - include
       8 preprocessor instruction - define
     */
    /*
       priority
       0. string
       1. stack
       2. character
     */
    var i=0
    var stack=[],top_stack=0
    stack[top_stack++]=0
    while(i<s.length){
        if(stack[top_stack-1]==0){
            var last_token
            last_token=syntaxHighlighter.get_token.call(s,i,
                regex_specifier_characters_first,
                regex_specifier_characters)
            if(i!=last_token){
                var token=s.substring(i,last_token)
                if(syntaxHighlighter.contain.call(stringset_keywords,token)){
                    x+='<span class="keywords">'+token+'</span>';
                }else if(syntaxHighlighter.contain.call(stringset_library,token)){
                    x+='<span class="library">'+token+'</span>';
                }else if(syntaxHighlighter.contain.call(stringset_stlcontainers,token)){
                    x+='<span class="stlcontainers">'+token+'</span>';
                }else if(syntaxHighlighter.contain.call(stringset_constants,token)){
                    x+='<span class="constants">'+token+'</span>';
                }else
                    x+=token;
                i=last_token;
                continue;
            }
            last_token=syntaxHighlighter.get_token.call(s,i,
                    regex_literal_characters_first,
                    regex_literal_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token)
                x+='<span style="color:darkviolet;">'+token+'</span>'
                i=last_token
                continue
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1
                x+=syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(s[i]=='#'){
                stack[top_stack++]=4
                x+='<span style="color:green;">'+syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(s[i]=='\''){
                stack[top_stack++]=5
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(s[i]=='"'){
                stack[top_stack++]=6
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:red;">'+
                    syntaxHighlighter.htmltextencode(s[i++])+
                '</span>'
                continue
            }
        }else if(stack[top_stack-1]==1){
            x+=syntaxHighlighter.htmltextencode(s[i++])
            top_stack--
            continue
        }else if(stack[top_stack-1]==2){
            if(s[i]=='\\'){
                stack[top_stack++]=1
                x+=syntaxHighlighter.htmltextencode(s[i++])
                continue
            }
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==3){
            if(i+1&&s[i]=='*'&&s[i+1]=='/'){
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                top_stack--;
                x+='</span>';
                continue;
            }
        }else if(stack[top_stack-1]==4){
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            var last_token;
            last_token=syntaxHighlighter.get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                x+=token;
                if(token=='include'){
                    stack[top_stack++]=7;
                    x+='<span style="color:darkred;">';
                }else if(token=='define'){
                    stack[top_stack++]=8;
                }
                i=last_token;
                continue;
            }
        }else if(stack[top_stack-1]==5){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                x+=syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==7){
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
        }else if(stack[top_stack-1]==8){
            if(s[i]=='\n'){
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=syntaxHighlighter.htmltextencode(s[i++]);
    }
    return x;
}
})()
