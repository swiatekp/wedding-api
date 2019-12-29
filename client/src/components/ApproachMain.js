import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
class ApproachMain extends Component {
    state = {
        churchHover: false,
        partyHover: false
    }
    mouseOver = (icon) => {
        if (icon === "church") {
            this.setState({ churchHover: true })
        }
        else if (icon === "party") {
            this.setState({ partyHover: true })
        }
    }
    mouseOut = (icon) => {
        if (icon === "church") {
            this.setState({ churchHover: false })
        }
        else if (icon === "party") {
            this.setState({ partyHover: false })
        }
    }
    render() {
        return (
            <div className="slider-container no-overflow approach-main">
                <h3>Dokąd chcesz dojechać?</h3>
                <div>
                    <NavLink to="/approach/church"
                        onMouseOver={this.mouseOver.bind(this, "church")}
                        onMouseOut={this.mouseOut.bind(this, "church")}>
                        <svg className="approachSvg" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                                <path d="M81.7363 66.5322V96.5022V96.6016H100.001V77.0893L81.7363 66.5322Z" fill={this.state.churchHover ? "#FDA0EE" : "#5A5656"} />
                                <path d="M0 96.6016H18.2642V96.5022V66.509L0 77.0894V96.6016Z" fill={this.state.churchHover ? "#FDA0EE" : "#5A5656"} />
                                <path d="M21.4897 56.3094V96.5023H40.2146V79.4619C40.2146 74.1174 44.5475 69.7845 49.892 69.7845H50.1075C55.452 69.7845 59.7849 74.1174 59.7849 79.4619V96.5023H78.5097V56.3094L49.9997 32.6603L21.4897 56.3094Z" fill={this.state.churchHover ? "#FDA0EE" : "#5A5656"} />
                                <path d="M8.87207 52.1248L13.7095 57.9951L50.0005 28.0913L86.2915 57.9951L91.1289 52.1248L52.2585 20.0958V12.9684H59.2363V8.45225H52.2585V3.39838H47.7424V8.45225H40.7647V12.9684H47.7424V20.0958L8.87207 52.1248Z" fill={this.state.churchHover ? "#FDA0EE" : "#5A5656"} />
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="100" height="100" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <p className="icon-text" style={this.state.churchHover ? { color: "#FDA0EE", transform: "scale(1.2)" } : null}>
                            Kościół
                </p>
                    </NavLink>
                    <NavLink to="/approach/party"
                        onMouseOver={this.mouseOver.bind(this, "party")}
                        onMouseOut={this.mouseOut.bind(this, "party")}>
                        <svg className="approachSvg" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M85.1562 58.5938H64.6484V52.4396C71.3266 51.0787 76.3672 45.1602 76.3672 38.0859V32.2266C76.3672 30.6086 75.0555 29.2969 73.4375 29.2969H52.9297V23.1428C59.6078 21.7818 64.6484 15.8633 64.6484 8.78906V2.92969C64.6484 1.31172 63.3367 0 61.7188 0H38.2812C36.6633 0 35.3516 1.31172 35.3516 2.92969V8.78906C35.3516 15.8631 40.3922 21.7816 47.0703 23.1428V29.2969H26.5625C24.9445 29.2969 23.6328 30.6086 23.6328 32.2266V38.0859C23.6328 45.16 28.6734 51.0785 35.3516 52.4396V58.5938H14.8438C13.2258 58.5938 11.9141 59.9055 11.9141 61.5234V67.3828C11.9141 74.4568 16.9547 80.3754 23.6328 81.7365V94.1406H20.7031C19.0852 94.1406 17.7734 95.4523 17.7734 97.0703C17.7734 98.6883 19.0852 100 20.7031 100H32.4219C34.0398 100 35.3516 98.6883 35.3516 97.0703C35.3516 95.4523 34.0398 94.1406 32.4219 94.1406H29.4922V81.7365C33.0641 81.0086 36.167 78.9768 38.2812 76.1617C40.3955 78.9768 43.4984 81.0086 47.0703 81.7365V94.1406H44.1406C42.5227 94.1406 41.2109 95.4523 41.2109 97.0703C41.2109 98.6883 42.5227 100 44.1406 100H55.8594C57.4773 100 58.7891 98.6883 58.7891 97.0703C58.7891 95.4523 57.4773 94.1406 55.8594 94.1406H52.9297V81.7365C56.5016 81.0086 59.6045 78.9768 61.7188 76.1617C63.833 78.9768 66.9359 81.0086 70.5078 81.7365V94.1406H67.5781C65.9602 94.1406 64.6484 95.4523 64.6484 97.0703C64.6484 98.6883 65.9602 100 67.5781 100H79.2969C80.9148 100 82.2266 98.6883 82.2266 97.0703C82.2266 95.4523 80.9148 94.1406 79.2969 94.1406H76.3672V81.7365C83.0453 80.3756 88.0859 74.457 88.0859 67.3828V61.5234C88.0859 59.9055 86.7742 58.5938 85.1562 58.5938ZM41.2109 58.5938V52.4396C44.7828 51.7117 47.8857 49.6799 50 46.8648C52.1143 49.6799 55.2172 51.7117 58.7891 52.4396V58.5938H41.2109Z" fill={this.state.partyHover ? "#FDA0EE" : "#5A5656"} />
                        </svg>
                        <p className="icon-text" style={this.state.partyHover ? { color: "#FDA0EE", transform: "scale(1.2)" } : null}>
                            Wesele
                </p>
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default ApproachMain;