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
         * @type {import('../types').episode}
         */
        const show = this.seasons
        const episodes = this.episode

        if (!show) {
            return html `<div></div>`
        }
        if (!episodes) {
            return html `<div></div>`
        }

        const backHandler = () => store.loadList() 
       
        const season = show.seasons.map(({ id ,title ,episodes ,image , seasons }) => { 
            
            const clickHandler = () => store.loadSingle(id)

            return html`
                <div>

                    <strong>${title}</strong>
                    <img src="${image}" width="300" height="300" @click="${clickHandler}">
                </div>
                <div>
                    ${episodes.map(({ id , episode ,file, title: innerTitle }) => {
                        return html`
                            <div>
                                <div>${innerTitle}</div>
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