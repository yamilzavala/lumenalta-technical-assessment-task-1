/*
To run test2.js, go to the root directory and run the following commands:
    # tsc
    # node test2.js
*/

import { SocialNetworkQueries } from './dist/SocialNetworkQueries.js';
import {data} from './dist/data/data.js';

const fetchCurrentUser = async () => {
    return data
};

(async () => {
    const socialNetworkQueries = new SocialNetworkQueries({ fetchCurrentUser });
    
    const minimalScore = 0.5;
    const potentialInterests = await socialNetworkQueries.findPotentialInterests(minimalScore);

    console.log("Books of potential interest:", potentialInterests);
})();
