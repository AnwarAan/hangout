// import jsonServer from "json-server"
// import bodyParser from "body-parser"
// import cors from 'cors'
// import { Low } from "lowdb"
// import { JSONFile } from 'lowdb/node'
// import { config } from 'dotenv'
// import { Webhook } from "svix"
// import { isThisWeek, isToday, isTomorrow } from "date-fns"

// config()

// const adapter = new JSONFile("./db.json")
// const db = new Low(adapter, {})
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

// server.use(jsonServer.bodyParser)
// server.use(middlewares)

// function getDateOnFilter(date, events) {
//     let filteredData = []
//     switch (date) {
//         case '0': {
//             filteredData = events.filter(event => isToday(new Date(event.date)))
//             break;
//         }
//         case "2": {
//             filteredData = events.filter(event => isTomorrow(new Date(event.date)))
//             break;
//         }
//         case "7": {
//             filteredData = events.filter(event => isThisWeek(new Date(event.date)))
//             break;
//         }
//         default: {
//             filteredData = []
//         }
//     }

//     return filteredData;
// }

// // update events favorites
// server.put("/events", async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     const users = db.data.users

//     const { id, userId } = req.query
//     const body = req.body

//     db.data.events = events.map(event => event.id === id ? body : event)
//     db.data.users = users.map(user => user.id === userId ? { ...user, favorites: [...user.favorites, id] } : user)
//     db.write()

//     res.jsonp({
//         success: "success",
//         message: "data has been updated"
//     })
// })

// server.get("/events/user", async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     const { id } = req.query

//     const filterData = events.filter(event => event.userId === id)

//     res.status(200).jsonp({
//         data: filterData
//     })
// })

// server.get("/revenue", async (req, res) => {
//     await db.read()
//     const { sellerId } = req.query

//     const transactions = db.data.transactions
//     const events = db.data.events
//     const currentTransactions = transactions
//         .filter(transaction => transaction.sellerId === sellerId)
//         .map(ct => {
//             const event = events.find(event => event.id === ct.eventId);
//             if (event) {
//                 return { price: ct.price, attendees: event.attendees.length };
//             }
//             return null;
//         })
//         .filter(e => e !== null);

//     res.json({
//         currentTransactions
//     })
// })

// server.get("/events/f", async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     const { date, price, category, q } = req.query

//     let filteredData = events
//     if (date) filteredData = getDateOnFilter(date, filteredData)
//     if (price) filteredData = filteredData.filter(event => event.type === price)
//     if (category) filteredData = filteredData.filter(event => event.category === category)

//     if (q) {
//         filteredData = filteredData.filter(event =>
//             event.name.toLowerCase().includes(q.toLocaleString().toLowerCase()))
//     }
//     res.jsonp({
//         data: filteredData.flat()
//     })
// })

// server.get("/events/location", async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     // const { loc, value } = req.query
//     const { value } = req.query

//     let filteredData = []

//     if (is_online) {
//         filteredData = events.filter(event => event.is_online === value)
//     }
//     console.log(req.query);
//     res.jsonp({
//         data: filteredData
//     })
// })

// server.get("/users/referals", cors(), async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     const { id } = req.query

//     const data = events.map(event => event.attendees.filter(attendee => attendee.userId === id)).flat()

//     const eventWithThatRef = data.reduce((result, ref) => {
//         const matchingEvents = events.filter(event => event.id === ref.eventId)
//         if (matchingEvents.length > 0) {
//             matchingEvents.forEach((event) => {
//                 event.referalCode = ref.myReferalCode
//             })

//             result.push(...matchingEvents)
//         }
//         return result
//     }, [])

//     res.jsonp({
//         data: eventWithThatRef || []
//     })
// })

// server.get("/events/ref", cors(), async (req, res) => {
//     await db.read()
//     const events = db.data.events
//     const { id } = req.query

//     const data = events.map(event => event.attendees.filter(attendee => attendee.userId === id)).flat()[0]
//     res.jsonp({
//         data: data || {}
//     })
// })

// // points calculate for referal code 
// server.post('/events/referal', async (req, res) => {
//     await db.read()
//     const events = await db.data.events
//     const users = await db.data.users

//     const { code, userId, eventId } = req.body

//     // find the referal code owner
//     const data = events.map(event => event.attendees.filter((attendee) => attendee.myReferalCode === code && eventId === event.id)).flat()[0]

//     // const isRedeem = users.map(user => user.referals.filter(referal => referal.id === userId)).flat().length > 0
//     const isRedeem = false
//     if (data && !isRedeem) {
//         // referal code owner
//         const { userId: ownerId, myReferalCode } = data
//         // checking to make sure only one user can redeem the code

//         db.data.users = users.map(user =>
//             user.id === ownerId && !isRedeem
//                 ? { ...user, points: user.points += 50, referals: [...user.referals, { myReferalCode, ownerId }] }
//                 : user)
//         await db.write()

//         db.data.users = users.map(user =>
//             user.id === userId && !isRedeem
//                 ? { ...user, points: user.points += 50, referals: [...user.referals, { myReferalCode, ownerId }] }
//                 : user)

//         await db.write()
//         return res.status(200).jsonp({
//             data: {
//                 status: 'success',
//                 msg: 'point has been added',
//                 data: data || [],
//             }
//         })
//     }

//     res.status(400).jsonp({
//         data: {
//             status: 'something wrong',
//             msg: 'point not been added',
//             data: data || [],
//         }
//     })
// })


// server.post('/events/reviews', async (req, res) => {
//     try {
//         await db.read()
//         const events = await db.data.events
//         const {
//             review,
//             eventId,
//             userCommentId,
//             id,
//             rating,
//             isChild,
//             commentId
//         } = req.body


//         if (isChild && commentId) {
//             db.data.events = events.map(event => event.id === eventId
//                 ? {
//                     ...event,
//                     reviews: event.reviews.map(comment => comment.id === commentId
//                         ? { ...comment, reviews: [...comment.reviews, { id, rating, review, userCommentId }] }
//                         : comment)
//                 }
//                 : event)
//         } else {
//             db.data.events = events.map(event => event.id === eventId
//                 ? { ...event, reviews: [...event.reviews, { id, rating, review, userCommentId }] }
//                 : event)
//         }
//         db.write()

//         res.jsonp({
//             msg: 'success'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// })

// // webhook for sync data clerk with local database
// server.post('/webhook', bodyParser.raw({ type: 'application/json' }), async function (req, res) {
//     try {
//         await db.read()
//         const payload = req.body;
//         const headers = req.headers;

//         const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY)

//         const evt = wh.verify(JSON.stringify(payload), headers);
//         const { id, first_name, last_name, email_addresses, gender, profile_image_url, username } = evt.data;
//         const email = email_addresses[0].email_address
//         // Handle the webhook
//         const eventType = evt.type;
//         if (eventType === "user.created") {
//             await db.data.users.push(
//                 {
//                     id,
//                     first_name,
//                     last_name,
//                     email,
//                     gender,
//                     imageUrl: profile_image_url,
//                     username,
//                     follower: [],
//                     favorites: [],
//                     referals: [],
//                     points: 0
//                 })
//             await db.write()
//         } else if (eventType === "user.updated") {
//             db.data.users = await db.data.users.map(user => user.id === id ?
//                 {
//                     ...user,
//                     first_name,
//                     last_name,
//                     email,
//                     gender,
//                     imageUrl: profile_image_url,
//                     username,
//                 } : user
//             )
//             await db.write()
//         } else if (eventType === "user.deleted") {
//             db.data.users = await db.data.users.filter(user => user.id !== id)
//             db.write()
//         }

//         res.status(200).jsonp({
//             success: true,
//             message: 'Webhook received'
//         })
//     } catch (err) {
//         res.status(400).jsonp({
//             success: false,
//             message: err.message
//         })
//     }
// })

// server.get("/config", (req, res) => {
//     res.send({
//         publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//     });
// });

// server.use(router)

// server.listen(3000, () => {
//     console.log('JSON Server is running')
// })

