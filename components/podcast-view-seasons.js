import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
import { store, connect } from '../store.js'

class Component extends LitElement {
    static get properties() {
        return {
            seasons: { state: true },
        }
    }

    constructor() {
        super()

        this.disconnectStore = connect((state) => {
            if (this.seasons === state.seasons) return
            this.seasons = state.seasons
        })
    }

    disconnectedCallback() { this.disconnectStore() }

    static styles = css`
       
    `;

    render() {
        /**
         * @type {import('../types').show}
         */
        const show = this.seasons
        if (!show) {
            return html `<div></div>`
        }

        const backHandler = () => store.loadList() 
       
        const season = show.seasons.map(({ id ,title , episodes , image }) => { 
            
            const clickHandler = () => store.loadSingle(id)

            return html`
                <div>
                    <strong>${title}</strong>
                    <img src="${image}" width="300" height="300" @click="${clickHandler}">
                </div>
                <div>
                    ${episodes.map(({ id , file, title: innerTitle }) => {
                        return html`
                            <div>
                                <div>${innerTitle}</div>
                                <audio controls>
                                    <source src="https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/11/file_example_MP3_700KB.mp3" type="audio/mp3">
                                </audio>
                                <button><span>&#11088;</span></button>
                                <button><span>&#128078;</span></button>
                            </div>
                        `
                    })}
                </div>
            `
        })

        return html`
            <button @click="${backHandler}">👈 BACK</button>
            <h1>${show.title || ''}</h1>
            <div>${season}</div>
        `
    }

 
}   
customElements.define('podcast-view-seasons', Component)