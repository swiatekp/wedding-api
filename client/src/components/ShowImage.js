import React from 'react';
import '../css/ShowImage.scss';
class ShowImage extends React.Component {
    state = {
        isZoomed: false
    }
    componentDidMount() {
        document.addEventListener('keydown', this.escHandler);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.escHandler);
    }
    toggleZoom = (e) => {
        e.stopPropagation();
        this.setState(prevState => ({
            isZoomed: !prevState.isZoomed
        }));
    }
    escHandler = e => {
        if (e.key === "Escape") {
            this.props.hideImage();
        }
    }
    clickOutsideTheImgHandler = e => {
        if (!e.target.classList.contains("image")) {
            this.props.hideImage();
        }
    }
    render = () => {
        return (
            <div onClick={this.clickOutsideTheImgHandler} className="showimage-background">
                <div>
                    <img className={`image ${this.state.isZoomed ? "" : "img-not-zoomed"}`} onClick={this.toggleZoom} src={this.props.path} alt="obrazek" />)
                    <button className="showimage-close-x" onClick={this.props.hideImage}>X</button>
                    <button className="showimage-close-button" onClick={this.props.hideImage}>Zamknij</button>
                </div>
            </div>
        );
    }
}

export default ShowImage;