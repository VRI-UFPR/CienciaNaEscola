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
