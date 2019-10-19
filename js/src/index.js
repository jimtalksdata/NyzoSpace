console.log("Hello Nyzo!")

const bip39 = require("bip39")

const { NyzoKey } = require("./NyzoKey")

const { NyzoStringPublicIdentifier } = require("nyzostrings/src/NyzoStringPublicIdentifier.js")
const { NyzoStringPrivateSeed } = require("nyzostrings/src/NyzoStringPrivateSeed.js")
const { nyzoStringEncoder } = require("nyzostrings/src/NyzoStringEncoder.js")

const { NyzoFormat } = require('./NyzoFormat')

function generate_mnemonic(bits=128) {
  const mnemonic = bip39.generateMnemonic(bits)
  const element = document.querySelector("#BIP39-input")
  element.value = mnemonic
}


function generate_mnemonic12() {
    generate_mnemonic(128)
}


function generate_mnemonic24() {
    generate_mnemonic(256)
}


function getKeyRow(index, seed, address, paperCode, extraClass='') {
    return  `
        <div class="col-12">
          <form>
            Seed ${index}: <input type="TEXT" class="form-control" value="${seed}"> Public Id ${index}: <input type="TEXT" class="form-control" value="${address}"><br />
            paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"><br />
          </form>
        </div>
    `
}


function getKeyRow2(index, seed, nyzoSeed, address, nyzoAddress, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table">
          <thead class="${tHeadClass}">
            <tr>
              <th>&nbsp;</th><th>Seed ${index}</th><th>Public Id ${index}</th>
            </tr>
          </thead>
            <tr>
              <td>Raw</td><td>${seed}</td><td>${address}</td>
            </tr>
            <tr>
              <td>NyzoString</td><td>${nyzoSeed}</td><td>${nyzoAddress}</td>
            </tr>
            <tr>
                <td colspan="3">paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"></td>
            </tr>
          </table>
        </div>
    `
}


function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const MasterKey = new NyzoKey().fromBIP39(mnemonic)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    for (i=1; i<=count; i++) {
        derived = MasterKey.derive(i)
        content += getKeyRow2(i, derived.toSeedHexWithDashes(), derived.toNyzoPrivateSeed(),
                                 derived.toPubKeyHexWithDashes(), derived.toNyzoPublicIdentifier(),
                                 derived.toPaperCode(), extraClass)
        if (extraClass =='') {extraClass = 'thead-light'} else {extraClass = ''}
    }
    wrapper.innerHTML = content
}

function generate_from_privk() {
    const ns = document.querySelector("#privk-input").value.trim()
    const key = new NyzoKey(ns)
    const string = key.toNyzoPublicIdentifier()
    const wrapper = document.querySelector("#ns-input")
    wrapper.value = string
	const wrapper2 = document.querySelector("#ns-input2")
	const string2 = key.toNyzoPrivateSeed()
	wrapper2.value = string2
}

function generate_from_pubk() {
    const ns = document.querySelector("#pubk-input").value.trim()
    const key = NyzoStringPublicIdentifier.fromHex(ns)
    const string = nyzoStringEncoder.encode(key)
    const wrapper = document.querySelector("#ns-input")
    wrapper.value = string
	const wrapper2 = document.querySelector("#ns-input2")
    wrapper2.value = ''
}

function generate_from_ns() {
    const ns = document.querySelector("#ns-input").value.trim()
    const keyObject = nyzoStringEncoder.decode(ns)
	const string = ''
	const wrapper = document.querySelector("#pubk-input")
	const wrapper2 = document.querySelector("#privk-input")
	const clearns = document.querySelector("#ns-input2")
	clearns.value = ''
	if (keyObject == null) {
		wrapper.value = ''
		wrapper2.value = ''
		alert("Not a nyzoString private or public key!!")
	}
	if (keyObject.constructor == NyzoStringPublicIdentifier) {
		wrapper.value = nyzoFormat.hexStringFromArrayWithDashes(keyObject.getIdentifier(), 0, 32)
		wrapper2.value = ''
	}
	else if (keyObject.constructor == NyzoStringPrivateSeed) {
		
		wrapper.value = ''
		wrapper2.value = nyzoFormat.hexStringFromArrayWithDashes(keyObject.getSeed(), 0, 64)
	}
	else {
		wrapper.value = ''
		wrapper2.value = ''
		alert("Not a nyzoString private or public key!!")
	}
}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
document.querySelector("#generate_from_privk").addEventListener("click", generate_from_privk)
document.querySelector("#generate_from_pubk").addEventListener("click", generate_from_pubk)
document.querySelector("#generate_from_ns").addEventListener("click", generate_from_ns)