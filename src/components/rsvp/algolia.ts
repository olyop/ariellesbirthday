import Algolia from "algoliasearch";

const algoliaClient = Algolia(
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
);

export const algoliaRSVPIndex = algoliaClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);
