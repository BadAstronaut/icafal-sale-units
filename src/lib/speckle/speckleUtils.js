import ObjectLoader from '@speckle/objectloader';
import fetch from 'cross-fetch'
import {
  streamCommitsQuery,
  streamSearchQuery,
  userInfoQuery
} from "./speckleQueries.js"


export let SERVER_URL = "https://speckle.xyz"


export async function getStreamObjects(streamId, token, objectId) {

  try {
    //console.log("loader speckle uils getstreamobjects ", token, objectId, streamId,)
    let loader = new ObjectLoader({
      serverUrl: SERVER_URL,
      streamId: streamId,
      token: token,
      objectId: objectId,
      options: { enableCaching: false, fullyTraverseArrays: false, excludeProps: []}
    })
    console.log("loader speckle uils getstreamobjects............... ", loader)
    let total = null
    let count = 0
    //get first value out of the iterator
    const first = await loader.getObjectIterator().next()
    console.log("first value from data table ", first)
    if (first.value) {
      return first.value.data
    }
  } catch (e) {
    console.log("error in getstreamobjects ", e)
  }

}
// Calls the GraphQL endpoint of the Speckle server with a specific query.
export async function speckleFetch(query, token) {
  //console.log("fetching with token ", token)
  if (token)
    try {

      var res = await fetch(`${SERVER_URL}/graphql`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query
        })
      })
      //console.log("try start")
      return await res.json()
    } catch (err) {
      console.error("API call failed", err)
      return err
    }
  else return Promise.reject("You are not logged in (token does not exist)")
}

export async function speckleUser(query) { }

// Fetch the current user data using the userInfoQuery
export const getUserData = (token) => { return speckleFetch(userInfoQuery(), token) }

// Fetch for streams matching the specified text using the streamSearchQuery
export const searchStreams = (e, token) => { return speckleFetch(streamSearchQuery(e)) }

// Get commits related to a specific stream, allows for pagination by passing a cursor
export const getStreamCommits = (streamId, itemsPerPage, cursor, token) => {
  return speckleFetch(streamCommitsQuery(streamId, itemsPerPage, cursor), token)
}

