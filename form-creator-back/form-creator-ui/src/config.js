const development = {
    genformsapi: {
        url: "http://200.236.31.188/api/"
    }
};

const production = {
    genformsapi: {
        url: ""
    }
};


let conf;
if(process.env.REACT_APP_STAGE === "production") {
    conf =  production;
} else {
    conf =  development;
}

const config =  conf;
export default config;
