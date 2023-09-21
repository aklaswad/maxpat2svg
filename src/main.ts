// import './app.css'
import App from './App.svelte'

const target = document.getElementById('app')
export default target ? new App({ target }) : undefined
