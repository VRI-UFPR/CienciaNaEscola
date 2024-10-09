import { React, useCallback, useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-sonic-silver {
        color: #787878;
    }

    .fs-7 {
        font-size: 1.1rem !important;
    }

    .location-input {
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

    .location-icon {
        max-width: 50px;
    }

    .search-col {
        min-width: 32px;
    }
`;

export function Location(props) {
    const { onAnswerChange, item, answer, disabled } = props;
    const iconContainerRef = useRef(null);
    const [iconSize, setIconSize] = useState(0);

    const updateIconSize = useCallback(() => {
        setIconSize(iconContainerRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        updateIconSize();
        window.addEventListener('resize', updateIconSize);
        return () => {
            window.removeEventListener('resize', updateIconSize);
        };
    }, [updateIconSize]);

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    const defaultLocation = useCallback(() => {
        if (!answer.text && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                updateAnswer({ ...answer, text: `${latitude}, ${longitude}` });
            });
        }
    }, [answer, updateAnswer]);

    useEffect(() => {
        defaultLocation();
    }, [defaultLocation]);

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="location-icon ratio ratio-1x1 align-self-center w-50 mx-auto" ref={iconContainerRef}>
                        <MaterialSymbol icon="location_on" size={iconSize} fill color="#FFFFFF" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="locationinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Localização
                        </label>
                    </div>
                    <div className="row m-0 align-items-center">
                        <div className="col m-0 p-0 pe-2">
                            <input
                                type="text"
                                className="location-input form-control color-sonic-silver rounded-0 shadow-none fw-semibold fs-6 p-0"
                                id="locationinput"
                                placeholder="Forneça sua localização"
                                onChange={(e) => updateAnswer({ ...answer, text: e.target.value })}
                                value={answer.text}
                                disabled={disabled}
                            ></input>
                        </div>
                        <div className="col-auto search-col d-flex justify-content-end m-0 p-0">
                            <RoundedButton
                                hsl={[190, 46, 70]}
                                onClick={() => {
                                    defaultLocation();
                                }}
                                icon="add_location"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Location;
