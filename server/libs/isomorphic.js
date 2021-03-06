const config = require('../../config')

const React = require('react')
const reactDom = require('react-dom/server') // { renderToString, renderToStaticMarkup }
const reactRouter = require('react-router') // { match, RouterContext }
const DocumentTitle = require('react-document-title')
const reactRedux = require('react-redux') // { Provider }
const fetchComponentData = require('./fetchComponentData')

const store = require('store') // { store }

console.log(reactDom);
const routes = require(`${config.PATH.FRONTSIDE}/route.jsx`)


module.exports = (req, res) => {
    const location = req.url
    match({ routes, location }, (error, redirectLocation, renderProps) => {
        if (error) {
            res.status(500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {

            // function userAuth (callback) {
            //  if (!req.user) return callback(true, null)

            //  const User = mongoose.model('User')
            //  const options = {
            //             criteria: {
            //                 _id: req.user.id
            //             },
            //             select: 'name username email hashed_password'
            //         }

            //     User.load(options, callback)
            // }

            // fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
            //     .then(() => {
                    // userAuth((err, user) => {
                    const InitialView = (<Provider store={ store }><RouterContext {...renderProps} /></Provider>)
                    const componentHTML = renderToString(InitialView)
                    let state = store.getState()
                    // state.user = user || {}
                    res.status(200).render('index', {
                        production: process.env.NODE_ENV === 'production',
                        app: componentHTML,
                        title: DocumentTitle.rewind(),
                        initialState: state
                    })

                    // })
                // })
                // .catch((err) => res.end(err.message))


        } else {
            res.status(404).send('Not found')
        }
    })
}
