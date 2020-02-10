const { bodyParser } = require('../bodyParser')
const { app } = require('../server')
const listHandler = require('./server/controller/listHandler')
const todoHandler = require('./server/controller/todoHandler')
const dotEnv = require('dotenv')

dotEnv.config()

app.use(bodyParser)

app.get('/list', listHandler.showAllList)
app.post('/list', listHandler.createList)
app.put('/list/:list_id', listHandler.updateList)
app.delete('/list/:list_id', listHandler.deleteList)

app.get('/todo/:list_id', todoHandler.showAllTodo)
app.post('/todo/:list_id', todoHandler.createTodo)
app.put('/todo/:todo_id', todoHandler.updateTodo)
app.delete('/todo/:todo_id', todoHandler.deleteTodo)

app.listen(process.env.APP_PORT, () =>
  console.log(`listening to port ${process.env.APP_PORT}`)
)
