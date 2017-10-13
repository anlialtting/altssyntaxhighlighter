let
    rollup=require('rollup'),
    skip=[
        'https://rawgit.com/anliting/althea/fc15503d703650e1e3a696260275cff0dcfc62d7/src/AltheaServer/HttpServer/files/lib/core.static.js'
    ]
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
        external:s=>skip.includes(s),
    })
    await bundle.write({
        file,
        format:'es',
        paths:s=>skip.includes(s)&&s,
    })
}
;(async()=>{
    await link(`highlighter.mjs`,`highlighter.static.mjs`)
    // for rawgit
    await link(`highlighter.mjs`,`highlighter.static.js`)
})
