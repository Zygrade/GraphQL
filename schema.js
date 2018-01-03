const axios = require('axios');

const {
      GraphQLObjectType,
      GraphQLList,
      GraphQLInt,
      GraphQLString,
      GraphQLSchema,
      GraphQLNonNull

} = require('graphql');

// Pokemon type
const PokemonType = new GraphQLObjectType({
    name : 'Pokemon',
    fields : () => ({
        id : { type : GraphQLString },
        name : { type : GraphQLString },
        Type : { type : GraphQLString },
        level : { type : GraphQLInt },
    })
});

// Mutations
const mutation = new GraphQLObjectType({
    name : 'Mutations',
    fields : {

        addPokemon : {
          type : PokemonType,
          args : {
             id : { type : new GraphQLNonNull(GraphQLString) },
             name : { type : new GraphQLNonNull(GraphQLString) },
             Type : { type : new GraphQLNonNull(GraphQLString) },
             level : { type : new GraphQLNonNull(GraphQLInt) }
          },

          resolve(parentValue,args) {
              return axios.post('http://localhost:3000/pokemons/',{
                  id : args.id,
                  name : args.name,
                  Type : args.Type,
                  level : args.level
              })
              .then(res => res.data);
          }
        },

        deletePokemon : {
          type : PokemonType,
          args : {
            id : { type : new GraphQLNonNull(GraphQLString) }
          },


        resolve(parentValue,args) {
          return axios.delete('http://localhost:3000/pokemons/' + args.id).then(res=>res.data);
        }
      },

        updatePokemon : {
          type : PokemonType,
          args : {
            id : { type : new GraphQLNonNull(GraphQLString) },
            name : { type : GraphQLString },
            Type : { type : GraphQLString },
            level : { type : GraphQLInt }
          },


        resolve(parentValue,args) {
          return axios.patch('http://localhost:3000/pokemons/' + args.id, args).then(res=>res.data);
        }
      }
    }
});

// Root Type
const RootQuery= new GraphQLObjectType({
     name : 'RootQueryType',
     type : PokemonType,
     fields : {
        pokemon : {
           type : PokemonType,
           args : {
              id : { type : GraphQLString }
           },

           resolve(parentValue,args) {

             return axios.get('http://localhost:3000/pokemons/' + args.id)
                    .then(res => res.data) ;
           }
        },

        pokemons : {
          type : new GraphQLList(PokemonType),
          resolve(parentValue,args) {
            return axios.get('http://localhost:3000/pokemons/')
                   .then(res => res.data) ;
          }
        }
      }
});

module.exports = new GraphQLSchema({
    query : RootQuery, mutation
});
