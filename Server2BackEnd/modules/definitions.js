const url = require('url')
const fs = require('fs')

class Definitions {

    constructor() {
        this.dictionary = []
        this.reqCount = 0
        this.messages = JSON.parse(fs.readFileSync('./lang/en/messages.json'))
    }

    handleRequest = (req, res) => {
        this.reqCount++
        if (req.method === "GET")
            return this.handleGet(req, res)
        if (req.method === "POST")
            return this.handlePost(req, res)
        if (req.method === "OPTIONS")
            return this.sendResponse(res, 200, '')
    }

    handleGet = (req, res) => {
        const urlParts = url.parse(req.url)
        const params = new URLSearchParams(urlParts.query)
        const word = params.get('word')
        const dictEntry = this.searchDictionary(word)
        const response = {}
        response.requestNumber = this.reqCount

        if (dictEntry === null) {
            response.error = this.messages.wordNotFound.replace("%1", word)
            return this.sendResponse(res, 400, JSON.stringify(response))
        }

        response.word = word
        response.defintion = dictEntry.definition
        return this.sendResponse(res, 200, JSON.stringify(response))
    }

    handlePost = (req, res) => {
        console.log("in handle post")
        let query = ""
        req.on("data", (chunk) => {
            query += chunk
        })
        req.on("end", () => {
            const body = JSON.parse(query)
            if (!body.word || !body.definition) {
                const response = {}
                response.requestNumber = this.reqCount
                response.error = this.messages.missingDefinition
                return this.sendResponse(res, 400, JSON.stringify(response))
            }
            if (!this.addToDictionary(body.word, body.definition)) {
                const response = {}
                response.requestNumber = this.reqCount
                response.error = this.messages.wordAlreadyExists.replace("%1", body.word)
                return this.sendResponse(res, 400, JSON.stringify(response))
            }
            const response = {}
            response.requestNumber = this.reqCount
            response.message = this.messages.wordAdded.replace("%1", body.word)
            return this.sendResponse(res, 200, JSON.stringify(response))
        })
    }

    sendResponse = (res, status, message) => {
        res.writeHead(status, { 
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'content-type': "application/json"
        })
        res.write(message)
        res.end()
    }

    searchDictionary = (word) => {
        for (let i = 0; i < this.dictionary.length; i++) {
            if (this.dictionary[i].word === word)
                return this.dictionary[i]
        }
        return null
    }

    addToDictionary = (word, definition) => {
        for (let i = 0; i < this.dictionary.length; i++) {
            if (this.dictionary[i].word === word)
                return false
        }

        console.log("adding...")
        this.dictionary.push({ word: word, definition: definition })
        return true
    }
}

module.exports = Definitions
