import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'
import { store, connect } from '../store.js'

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

class Component extends LitElement {
    static get properties() {
        return {
            previews: { state: true },
            sorting: { state: true },
            search: { state: true },
        }
    }

    constructor() {
        super()

        this.disconnectStore = connect((state) => {
            if (this.previews !== state.previews) { this.previews = state.previews }
            if (this.sorting !== state.sorting) { this.sorting = state.sorting }
            if (this.search !== state.search) { this.search = state.search } 
        })
    }

    disconnectedCallback() { this.disconnectStore() }

    static styles = css`
        .ds-i {
            display: flex;
            flex-direction: column;
            align-content: space-between;
        }

        .tl{
            display: flex;
            align-content: flex-start;
        }

        div {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        h2 {
            flex: 1 1 0%;
            margin: 0;

        }

        div .genre {
            flex: 1 1 0%;
        }
    `;

    render() {
        /**
         * @type {import('../types').preview[]}
         */
        const previews = this.previews


        const filteredPreviews = previews.filter(item => {
            if (!this.search) return true
            return item.title.toLowerCase().includes(this.search.toLowerCase())
        })

        const sortedPreviews = filteredPreviews.sort((a, b) => {
            if (this.sorting === 'a-z') return a.title.localeCompare(b.title)
            if (this.sorting === 'z-a') return b.title.localeCompare(a.title)

            const dateA = new Date(a.updated).getTime()
            const dateB = new Date(b.updated).getTime()

            if (this.sorting === 'oldest-latest') return dateA - dateB
            if (this.sorting === 'latest-oldest') return dateB - dateA

            throw new Error('Invalid sorting')
         })

        const list = sortedPreviews.map(({ title, id, image, updated, genres, seasons }) => {
            const date = new Date(updated)
            const day = date.getDate()
            const month = MONTHS[date.getMonth() - 1]
            const year = date.getFullYear()

            const clickHandler = () => store.loadSingle(id)
            const clickHandler1 = () => store.loadSeasons(id)

            return html`
                    <div class="ds-i">
                        <h2>${title}</h2><button><h3 @click="${clickHandler}"> Seasons: ${seasons}</h3></button>
                        <img src="${image}" width="300" height="300" @click="${clickHandler1}">
                        <div>Updated: ${day} ${month} ${year}</div>
                        <p class="genre" >Genres: ${genres}</p>
                    </div> 
            `
        })

        return html`
            <h1>Podcast List</h1>
                <podcast-controls></podcast-controls>
            ${list.length > 0 ? html`<div>${list}</div>` : html`<div>No matches</div>`}
        `
    }
}

customElements.define('podcast-view-list', Component)