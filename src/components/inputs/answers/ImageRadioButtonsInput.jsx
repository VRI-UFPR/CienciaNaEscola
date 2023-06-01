import { React, useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import eyeIcon from '../../../assets/images/eyeIcon.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .color-dark-gray {
        color: #535353;
    }
`;

function ImageRadioButtonsInput(props) {
    const { onAnswerChange, input, answer, images } = props;
    const [options, setOptions] = useState(new Array(input.sugestions.length).fill('false'));
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    useEffect(() => {
        onAnswerChange(input.id, options);
    }, [options, input.id, onAnswerChange]);

    const handleOptionsUpdate = (index) => {
        const array = new Array(input.sugestions.length).fill('false');
        array[index] = 'true';
        setOptions(array);
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0 pb-3">
                <p className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0">{input.question}</p>
            </div>
            <div className="row m-0 mx-auto pb-3 justify-content-center position-relative" style={{ maxWidth: '1200px' }}>
                {images.slice(0, ImageVisibility ? images.length : 3).map((image, index) => {
                    return (
                        <div key={index} className={`col-4 m-0 p-1 p-lg-2 ${index < 3 ? 'pt-0' : ''}`}>
                            <div className="ratio ratio-1x1 bg-grey rounded-4">
                                <img src={image} className="img-fluid object-fit-contain" alt="Responsive image" />
                            </div>
                        </div>
                    );
                })}
                <div className="row p-1 p-lg-2 m-0 mb-3 position-absolute bottom-0 end-0 justify-content-end">
                    <RoundedButton className="mb-2 me-2" hsl={[190, 46, 70]} icon={eyeIcon} onClick={toggleImageVisibility} />
                </div>
            </div>
            <div className="row m-0 px-2">
                {input.sugestions.map((option, index) => {
                    const optname = option.value.toLowerCase().replace(/\s/g, '');
                    return (
                        <div key={optname + 'input'} className="form-check col-12 col-lg-6 m-0 pb-2 pe-2">
                            <input
                                className={`form-check-input bg-grey ${answer && answer[index].value === 'true' ? 'opacity-100' : ''}`}
                                type="radio"
                                name={'radiooptions' + input.id}
                                id={optname + 'input'}
                                onChange={() => handleOptionsUpdate(index)}
                                checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                disabled={answer !== undefined}
                            ></input>
                            <label
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 ${
                                    answer && answer[index].value === 'true' ? 'opacity-100' : ''
                                }`}
                                htmlFor={optname + 'input'}
                            >
                                {option.value}
                            </label>
                        </div>
                    );
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

ImageRadioButtonsInput.defaultProps = {
    images: [
        'https://picsum.photos/900/1300?random=1',
        'https://picsum.photos/900/1300?random=2',
        'https://picsum.photos/900/1300?random=3',
        'https://picsum.photos/900/1300?random=4',
        'https://picsum.photos/900/1300?random=5',
        'https://picsum.photos/900/1300?random=6',
        'https://picsum.photos/900/1300?random=7',
        'https://picsum.photos/900/1300?random=8',
    ],
};

export default ImageRadioButtonsInput;
