import React, { Component } from 'react';
class ApproachButton extends Component {
    state = {
        active: false
    }
    mouseOver = () => {
        this.setState({ active: true })
    }
    mouseOut = () => {
        this.setState({ active: false })
    }
    render() {
        return (
            <button
                onClick={this.props.toggleApproachPopup}
                onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut}
                className="approach"
            >
                <span>Jak dojechać?</span>
                <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill={this.state.active ? "#FDA0EE" : "#828282"} d="M29.2913 9.33339C29.1363 8.83311 28.8215 8.30006 28.5886 7.83335C25.8021 2.06667 19.7135 0 14.7974 0C8.21615 0 0.967726 3.80011 0 11.633V13.2333C0 13.3001 0.0267294 13.9 0.0646973 14.2001C0.607182 17.9331 4.02784 21.9004 6.58252 25.6334C9.33099 29.6329 12.1829 33.5673 15.0085 37.5C16.7507 34.9336 18.4867 32.3334 20.1893 29.8334C20.6533 29.0998 21.192 28.3665 21.6565 27.6662C21.9661 27.2 22.5576 26.7337 22.8278 26.2999C25.5762 21.9668 30 17.6002 30 13.3V11.5335C30.0001 11.0673 29.329 9.43392 29.2913 9.33339ZM14.9178 17.3669C12.9833 17.3669 10.8658 16.5339 9.82062 14.2335C9.6649 13.8673 9.67746 13.1335 9.67746 13.0663V12.0329C9.67746 9.10034 12.5691 7.76674 15.0847 7.76674C18.1817 7.76674 20.5769 9.90036 20.5769 12.5672C20.5769 15.234 18.0148 17.3669 14.9178 17.3669Z" />
                </svg>
            </button>
        );
    }
}

export default ApproachButton;