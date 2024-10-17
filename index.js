import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js"

const resolvers = {
    Query: {
        games() {
            return db.games
        },
        reviews() {
            return db.reviews
        },
        authors() {
            return db.authors
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id)
        },
        game(_, args) {
            return db.games.find((game) => game.id === args.id)
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
        }
    },
    Game: {
        review(parent) {
            return db.reviews.filter((r) => r.game_id === parent.id)
        }
    },
    Author: {
        review(parent) {
            return db.reviews.filter((r) => r.author_id === parent.id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
            return db.games = db.games.filter((g) => g.id !== args.id)
        },
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)
            return game
        },
        editGame(_, args) {
            let game = db.games.find((game) => game.id === args.id)
            game.title = args.game.title
            //db.games[args.id] = game
            return game
        }
    }
}
// server setup
const server = new ApolloServer({
    // typedefs
    typeDefs,
    // resolvers
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000
    }
})

console.log(`Server ready at port 4000`);
