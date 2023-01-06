import './components/podcast-app.js'
import './components/podcast-view-list.js'
import './components/podcast-view-single.js'
import './components/podcast-controls.js'
import './components/podcast-view-seasons.js'

window.addEventListener('load', function() {
    init();
    window.addEventListener('scroll', () => {
        //header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 500) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})