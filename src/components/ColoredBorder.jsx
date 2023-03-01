import React from "react";

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-steel-blue {
        background-color: #4E9BB9;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .border-cell {
        height: 10px;
    }
`;

function ColoredBorder(props) {
    return (
        <div className="row w-100 p-0 m-0">
            <div className="col border-cell bg-pastel-blue"></div>
            <div className="col border-cell bg-coral-red"></div>
            <div className="col border-cell bg-yellow-orange"></div>
            <div className="col border-cell bg-steel-blue"></div>
            <div className="col border-cell bg-crimson"></div>
            <div className="col border-cell bg-lime-green"></div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default ColoredBorder;
