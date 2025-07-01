import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import { Schema, SchemaCheck, Match } from 'effect'

// const schema = Schema.Struct({
//   name: Schema.String.check(SchemaCheck.minLength(3)),
//   age: Schema.Number,
// })

// const user = {
//   name: 'John',
//   age: 123,
// }

// console.log(schema.ast)
 
// const validated = Schema.decodeUnknownSync(schema)(user)

// const standard = Schema.standardSchemaV1(schema, {
//   leafHook: (issue) => {
//     return issue._tag
//   },
//   checkHook: (issue) => {
//     return issue._tag
//   }
// })

// const result = standard["~standard"].validate({
//   string: "string",
//   number: 2,
//   boolean: true,
//   array: [2, 'string', true]
// })

// console.log({ result })

// console.log(validated)

// const a = Schema.String

// console.log('a', a.ast)

// const match = Match.value(a.ast).pipe(
//   Match.tag('StringKeyword', () => 2),
//   // @ts-expect-error
//   Match.tag('NumberKeyword', () => 3),
//   Match.exhaustive
// )

createApp(App).mount('#app')
