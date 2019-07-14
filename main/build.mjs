import fs from'fs'
import rollup from'rollup'
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
    })
    return(await bundle.generate({
        file,
        format:'es',
    })).output[0].code
}
;(async()=>{
    fs.promises.writeFile(
        'dist/wcv.mjs',
        `/*${
            await fs.promises.readFile('license','utf8')
        }*/${
            await link(`main/main.mjs`)
        }`
    )
})()
