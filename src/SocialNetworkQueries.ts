type Rating = {
    title: string;
    score: number;
}

type User = {
    id?: string;
    ratings?: Rating[];
    friends?: Array<{ 
        id?: string;
        ratings?: Rating[];
    }>
}

export class SocialNetworkQueries {
    private fetchCurrentUser: () => Promise<User>;
    private cacheUser: User | null = null;

    constructor(input: { fetchCurrentUser: () =>  Promise<User>}) {
        this.fetchCurrentUser = input.fetchCurrentUser;
    }

    private async getCurrentUser(): Promise<User | null> {
        try {
            const user = await this.fetchCurrentUser();
            this.cacheUser = user;
            return user;
        } catch (error) {
            return this.cacheUser;
        }
    }

    async findPotentialInterests(minimalScore: number = 0.5): Promise<string[]> {
        // TODO: Impl your code
        const user = await this.getCurrentUser();
        if(!user || !user.ratings || !user.friends) {
            return []
        }

        const userRatedTitles = new Set(user.ratings.map(rating => rating.title))
        const bookScores: Record<string, {totalScore: number, count: number}> = {}

        for(const friend of user.friends) {
           if(!friend.ratings) continue;

           const uniqueRatings = new Map<string, Rating>();

           for(const rating of friend.ratings) {
            if(!uniqueRatings.has(rating.title) || uniqueRatings.get(rating.title)!.score < rating.score) {
                uniqueRatings.set(rating.title, rating)
            }
           }

           for(const {title, score} of uniqueRatings.values()) {
            if(userRatedTitles.has(title)) continue;

            if(!bookScores[title]) {
                bookScores[title] = {totalScore: 0, count: 0};
            }

            bookScores[title].totalScore += score;
            bookScores[title].count += 1;
           }
        }

        const potentialInterests = Object.entries(bookScores)
            .map(([title, { totalScore, count }]) => ({
                title,
                averageScore: totalScore / count,
            }))
            .filter(({averageScore}) => averageScore >= minimalScore)
            .sort((a,b) => 
                b.averageScore - a.averageScore || 
                a.title.localeCompare(b.title, "en", { sensitivity: "base" }))
            .map(({title}) => title);
        
            return potentialInterests;

    }

}


