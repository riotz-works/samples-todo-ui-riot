'use strict';
import buble from 'buble';

const config = {
    type: 'buble',
    parsers: {
        js: { 
            buble: js => buble.transform(js) 
        }
    }
};

export default config;
