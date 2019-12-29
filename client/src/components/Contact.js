import React from 'react';
import PhoneImg from '../img/phone.svg';
import MailImg from '../img/mail.svg';
import '../css/Contact.scss';

const Contact = (props) => {
    const { brideTel, brideMail, groomTel, groomMail } = props.pageInfo;

    return (
        <div className="slider-container info-container no-overflow contact-container">
            <div className="phone-mail">
                <img src={PhoneImg} alt={PhoneImg} />
                <a href={`tel:${brideTel.replace(/[- ]/g, '')}`}>{brideTel}</a>
                <img src={MailImg} alt={MailImg} />
                <a href={`mailto:${brideMail}`}>{brideMail}</a>
            </div>
            <div className="phone-mail">
                <img src={PhoneImg} alt={PhoneImg} />
                <a href={`tel:${groomTel.replace(/[- ]/g, '')}`}>{groomTel}</a>
                <img src={MailImg} alt={MailImg} />
                <a href={`mailto:${groomMail}`}>{groomMail}</a>
            </div>
        </div>
    );
}

export default Contact;