// const data = {
//     id: "mrouk3",
//     ratings: [
//       { title: "Moby Dick", score: 0.6 },
//       { title: "Crime and Punishment", score: 0.8 }
//     ],
//     friends: [{
//       id: "YazL",
//       ratings: [
//         { title: "Crime and Punishment", score: 0.8 },
//         { title: "Brave New World", score: 0.4 }
//       ],
//     }, {
//       id: "queen9",
//       ratings: [
//         { title: "Pride and Prejudice", score: 0.8 },
//         { title: "Crime and Punishment", score: 0.5 }
//       ],
//     }, {
//       id: "joyJoy",
//       ratings: [
//         { title: "Moby Dick", score: 0.2 },
//         { title: "Pride and Prejudice", score: 1 }
//       ],
//     }, {
//       id: "0sin5k1",
//       ratings: [
//         { title: "Pride and Prejudice", score: 0.8 },
//         { title: "Brave New World", score: 0.2 }
//       ],
//     }, {
//       id: "mariP",
//       ratings: [
//         { title: "Moby Dick", score: 0.8 },
//         { title: "Frankenstein", score: 0.8 },
//         { title: "Crime and Punishment", score: 0.4 }
//       ]
//     }],
// }

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

// export const fetchCurrentUser = async (): Promise<User> => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(data)
//         }, 1000)
//     })
// }

class SocialNetworkQueries {
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


