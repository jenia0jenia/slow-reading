import { isVisibleTab } from "./helpers.js"

class Tip {
    constructor() {}
}

class Text {
    constructor(text, texSelector, textSelectorArray) {
        this.text = text
        this.wordIndex = 0
        this.activeClass = "is-visible"
        this.textDom = document.querySelector(texSelector)
        this.textDom.innerHTML = text
        this.textDomArray = Array.from(
            document.querySelectorAll(textSelectorArray)
        )
        this.factorPlus = 0
        this.factorMinus = 0
    }

    showOneWord() {
        if (this.wordIndex < 0) {
            this.wordIndex = 0
        }

        if (this.wordIndex < this.textDomArray.length) {
            this.textDomArray[this.wordIndex++].classList.add(this.activeClass)
        }
    }

    // showWords from currentWordIndex to pos
    showWordsWithFactor() {
        const toPos = this.wordIndex + 1

        this.factorMinus = 0
        if (this.wordIndex < 0) {
            this.wordIndex = 0
        }

        while (this.wordIndex < toPos + this.factorPlus) {
            if (this.wordIndex >= this.textDomArray.length) {
                break
            }

            this.textDomArray[this.wordIndex++].classList.add(this.activeClass)
        }

        if (this.wordIndex < this.textDomArray.length) {
            this.factorPlus++
        }
    }

    hideWordsWithFactor() {
        const toPos = this.wordIndex - 1
        this.factorPlus = 0

        if (this.wordIndex < 0) {
            this.wordIndex = 0
        }

        while (this.wordIndex > toPos - this.factorMinus) {
            if (this.wordIndex < 0) {
                break
            }

            if (this.wordIndex >= this.textDomArray.length) {
                this.wordIndex--
                continue
            }

            this.textDomArray[this.wordIndex--].classList.remove(
                this.activeClass
            )
        }

        this.factorMinus++
    }
}

fetch("/api/text")
    .then((res) => res.text())
    .then((res) => {
        const slowText = new Text(res, ".text", ".text span")
        const playButton = document.querySelector(".play")
        let activeReading = true
        let activeScroll = false

        slowText.textDom.addEventListener("mouseover", (e) => {
            activeScroll = true
        })

        slowText.textDom.addEventListener("mouseout", (e) => {
            activeScroll = false
        })

        window.addEventListener("wheel", (e) => {
            if (activeScroll) {
                if (e.deltaY > 0) {
                    slowText.showWordsWithFactor()
                } else {
                    slowText.hideWordsWithFactor()
                }
            }

            return false
        })

        document.addEventListener("keyup", toggleReading)
        playButton.addEventListener("click", toggleReading)

        function slowReading() {
            const randomTime = 1 + Math.random() * 500
            console.log(randomTime)

            setTimeout(() => {
                if (activeReading && isVisibleTab()) {
                    slowText.showOneWord()
                }

                if (
                    activeReading &&
                    slowText.wordIndex < slowText.textDomArray.length
                ) {
                    slowReading()
                }
            }, randomTime)
        }

        function toggleReading(event) {
            if (
                event.target.classList.contains("play") ||
                event.key == " " ||
                event.code == "Space" ||
                event.keyCode == 32
            ) {
                activeReading = !activeReading

                if (activeReading) {
                    slowReading()
                }
            }
            event.target.blur()
        }

        slowReading()
    })
