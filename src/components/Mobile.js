import React from 'react'
import './style/mobile.css'

export default function Mobile() {
    return (
        <div className="mobile">
            <div className="mobile-content">
                {/* <div className="game">
                    <div className="player">

                    </div>
                </div> */}
                <div className="mobile-content-message">
                    <h1>
                        Sorry!
                        <br/>
                        Mobile not supported
                    </h1>
                </div>
            </div>
        </div>
    )
}
