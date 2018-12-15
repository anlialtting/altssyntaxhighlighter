import rollup from 'rollup'
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
    })
    await bundle.write({
        file,
        format:'es',
    })
}
;(async()=>{
    await link(`highlighter.mjs`,`highlighter.static.mjs`)
})()
