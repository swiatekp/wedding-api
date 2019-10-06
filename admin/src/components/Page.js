import React from 'react';
import '../css/Page.scss';
const Page = () => {
    return (
        <div className="page-container">
            <h2>Edytuj stronę</h2>
            <form className="page-form" autoComplete="off" >
                <section>
                    <label htmlFor="pageTitle">Tytuł strony</label>
                    <input className="input" type="text" id="pageTitle" />
                    <label htmlFor="weddingDate">Data ślubu</label>
                    <input className="input" type="date" id="weddingDate" />
                    <label htmlFor="landingpageText">Tekst na stronie głównej</label>
                    <textarea className="input" id="landingPageText"></textarea>
                </section>
                <section>
                    <label htmlFor="brideName">Imię narzeczonej</label>
                    <input className="input" type="text" id="brideName" />
                    <label htmlFor="brideTel">Numer telefonu</label>
                    <input className="input" type="text" id="brideTel" />
                    <label htmlFor="brideMail">Adres e-mail</label>
                    <input className="input" type="text" id="brideMail" />
                </section>
                <section>
                    <label htmlFor="groomName">Imię narzeczonego</label>
                    <input className="input" type="text" id="groomName" />
                    <label htmlFor="groomTel">Numer telefonu</label>
                    <input className="input" type="text" id="groomTel" />
                    <label htmlFor="groomMail">Adres e-mail</label>
                    <input className="input" type="text" id="Mail" />
                </section>
                <button class="page-button" type="button">Zatwierdź</button>
            </form>
        </div>
    );
}

export default Page;