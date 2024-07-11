/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import Markdown from 'markdown-to-jsx';

const MarkdownStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-steel-blue {
        color: #4E9BB9;
    }
`;

function MarkdownText(props) {
    const { text } = props;
    return (
        <>
            <Markdown
                options={{
                    wrapper: 'div',
                    forceWrapper: true,
                    forceBlock: true,
                    overrides: {
                        img: {
                            props: {
                                className: 'w-100 rounded-4',
                            },
                        },
                        h6: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        h5: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        h4: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        h3: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        h2: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        h1: {
                            props: {
                                className: 'fw-bold fs-5 mb-3 text-break',
                            },
                        },
                        p: {
                            props: {
                                className: 'mb-3 text-break',
                            },
                        },
                        a: {
                            props: {
                                className: 'color-steel-blue mb-3 text-break',
                            },
                        },
                    },
                }}
                className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0"
            >
                {text}
            </Markdown>
            <style>{MarkdownStyles}</style>
        </>
    );
}

export default MarkdownText;
