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
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        h5: {
                            props: {
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        h4: {
                            props: {
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        h3: {
                            props: {
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        h2: {
                            props: {
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        h1: {
                            props: {
                                className: 'fw-bold fs-5 mb-3',
                            },
                        },
                        p: {
                            props: {
                                className: ' mb-3',
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
