import React, { useEffect, useRef, useState, useCallback } from 'react';

const styles = `
    @keyframes slideAnimation {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(-100%);
        }
    }

    .looper {
        width: 100%;
        overflow: hidden;
    }

    .looper__innerList {
        display: flex;
        justify-content: center;
        width: fit-content;
    }

    .looper__innerList[data-animate="true"] .looper__listInstance {
        animation: slideAnimation linear infinite;   
    }

    .looper__listInstance {
        display: flex;
        width: max-content;
        animation: none;
    }
        
`;

function InfitiniteLooper(props) {
    const { children, speed = 10, direction = 'left' } = props;
    const [looperInstances, setLooperInstances] = useState(3);
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    const setupInstances = useCallback(() => {
        if (!innerRef?.current || !outerRef?.current) return;

        const { width } = innerRef.current.getBoundingClientRect();

        const { width: parentWidth } = outerRef.current.getBoundingClientRect();

        const instanceWidth = width / innerRef.current.children.length;

        if (width < parentWidth + instanceWidth) {
            setLooperInstances(looperInstances + Math.ceil(parentWidth / width));
        }

        if (innerRef?.current) {
            innerRef.current.setAttribute('data-animate', 'false');

            setTimeout(() => {
                if (innerRef?.current) {
                    innerRef.current.setAttribute('data-animate', 'true');
                }
            }, 50);
        }
    }, [innerRef, outerRef, looperInstances]);

    useEffect(() => {
        window.addEventListener('resize', setupInstances);

        return () => {
            window.removeEventListener('resize', setupInstances);
        };
    }, [setupInstances]);

    return (
        <>
            <div className="looper" ref={outerRef}>
                <div className="looper__innerList" ref={innerRef} data-animate="true">
                    {[...Array(looperInstances)].map((_, ind) => (
                        <div
                            key={ind}
                            className="looper__listInstance"
                            style={{
                                animationDuration: `${speed}s`,
                                animationDirection: direction === 'right' ? 'reverse' : 'normal',
                            }}
                        >
                            {children}
                        </div>
                    ))}
                </div>
            </div>
            <style>{styles}</style>
        </>
    );
}

export default InfitiniteLooper;
