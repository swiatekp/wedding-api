import React from 'react';
import { NavLink } from 'react-router-dom';
const ApproachParty = (props) => {
    return (
        <div className="slider-container approach-show">
            <h3>Dojazd na wesele</h3>
            <div className="approach-show-container">
                <p>
                    Wesele odbędzie się w dworku <i>Banderoza</i> w Osiecznej. Lokal znajduje się nad jeziorem, około 15 kilometrów od Kościoła.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party1.png"))} className="approach-preview"></button>
                <p>
                    Aby znaleźć się w Osiecznej, należy wjechać na wiadukt, a następnie udać się w kierunku Śremu. Do dnia ślubu, widoczne na załączonym zdjęciu objazdy powinny zostać zlikwidowane.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party2.png"))} className="approach-preview"></button>
                <p>
                    Na widocznym na zdjęciu skrzyżowaniu skręcamy w prawo.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party3.png"))} className="approach-preview"></button>
                <p>
                    Jedziemy na wprost, ulicą Leszczyńską, aż do Rynku. Po przedostaniu się na przeciwległy koniec Rynku, jedziemy prosto ulicą Steinmetza.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party4.png"))} className="approach-preview"></button>
                <p>
                    Na skrzyżowaniu z ulicą Gostyńską, jedziemy w prawo.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party5.png"))} className="approach-preview"></button>
                <p>
                    Natychmiast potem znajdziemy się przed rozwidleniem dróg. Wybieramy tę po naszej lewej stronie.
                </p>
                <button onClick={() => props.showImage(require("../img//location/party6.png"))} className="approach-preview"></button>
                <p>
                    Jedziemy prosto do momentu, w którym po naszej prawej stronie ukaże się sporych rozmiarów parking. Skręcamy w prawo.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party7.png"))} className="approach-preview"></button>
                <p>
                    Wjeżdżamy w drogę oznaczoną znakiem <i>Zakaz ruchu w obu kierunkach</i>. Zakaz ten nas nie dotyczy.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party8.png"))} className="approach-preview"></button>
                <p>
                    Jedziemy prosto, aż naszym oczom ukaże się lokal. W tym dniu trudno będzie go przeoczyć.
                </p>
                <button onClick={() => props.showImage(require("../img/location/party8.png"))} className="approach-preview"></button>
            </div>
            <p>
                Źródło: <cite>Google Maps</cite>.
            </p>
            <NavLink className="return-link" to="/approach">&lt;&lt; Powrót</NavLink>
        </div >
    );
}

export default ApproachParty;