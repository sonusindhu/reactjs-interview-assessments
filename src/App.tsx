import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Link } from 'react-router'

function App() {

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Examples</h1>
        </div>
        
        <div className="examples">

          <ul>
            <li>
              <Link to="/accordion" className="example-link">
                React Accordion
              </Link>
            </li>
            <li>
              <Link to="/autocomplete" className="example-link">
                React Autocomplete
              </Link>
            </li>
            <li>
              <Link to="/data-table" className="example-link">
                React Data Table
              </Link>
            </li>
            <li>
              <Link to="/todos" className="example-link">
                React Todos
              </Link>
            </li>
          </ul>

        </div>

      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        
        <div id="social">
          <div className="author">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#social-icon"></use>
            </svg>
            Sonu Sindhu
          </div>
          <h2>Connect with me</h2>
          <p>Join the React community</p>
          <ul>
            <li>
              <a href="https://github.com/sonusindhu" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://x.com/sonusindhu10" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
