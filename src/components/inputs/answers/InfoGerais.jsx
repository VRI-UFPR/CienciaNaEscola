import { React, useEffect, useState } from 'react';

const styles = `
    .color-dark-gray {
        color: #535353;
    }

    .bloco-info-gerais {
        border-top: 12px solid #F59489;
    }

    #infogerais {
        background: transparent;
        border: none;
        border-bottom: 1px solid #787878;
        -webkit-box-shadow: none;
    }
`;

function InfoGerais(props) {
    const [infos, setInfos] = useState(['']);
    const { onAnswerChange, input, answer } = props;

    useEffect(() => {
        onAnswerChange(input.id, infos);
    }, [infos, input.id, onAnswerChange]);

    return (
        <div className="bloco-info-gerais rounded-4 shadow bg-white w-100">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row rounded m-0 p-0 pb-3">
                    <label htmlFor="infogerais" className="control-label color-dark-gray fw-bold fs-5 lh-lg p-0">
                        Informações gerais:
                    </label>
                    <input
                        type="text"
                        name="infogerais"
                        className="form-control rounded-0 shadow-none p-0"
                        id="infogerais"
                        placeholder="Adicionar descrição"
                        onChange={(e) => setInfos([e.target.value])}
                        value={answer ? answer[0].value : infos}
                        disabled={answer !== undefined}
                    />
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default InfoGerais;
