const requests = require('requests')
const fs = require('fs')
const http = require('http')

const homeFile = fs.readFileSync('index.html', 'utf-8')
const replaceVal = (tempVal, orgVal)=>{
    let randomNo = Math.floor(Math.random() * 20)
    let temp = tempVal.replace('{%Quote%}', orgVal[randomNo].text)
    temp = temp.replace('{%Author%}', orgVal[randomNo].author || 'unknown')
    temp = temp.replace('Var-Quote', orgVal[randomNo].text)
    temp = temp.replace('Var-Author', orgVal[randomNo].author || 'unknown')
    return temp
}

const server = http.createServer((req,res)=>{
    if (req.url == '/') {
        const getDataBYApiInJson = requests('https://type.fit/api/quotes')
        getDataBYApiInJson.on('data', (chunk)=>{
        const getDataBYApiInArr = JSON.parse(chunk)
        const realData = replaceVal(homeFile,getDataBYApiInArr) 
        res.write(realData)
        })
        getDataBYApiInJson.on('end', (err)=>{
            if (err) {
                res.end('<h1>We could not access the data</h1>', err)
            }
            else{
                res.end()
            }
        })
    } else {
        res.end('<h1>404 Web page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('server is listening on port 8000');
})