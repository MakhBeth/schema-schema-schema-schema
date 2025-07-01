<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import FieldState from './FieldState.vue'
import { SchemaCheck, Schema, Match } from 'effect'
import type { AST, PropertySignature } from 'effect/SchemaAST'

const schema = Schema.Struct({
  name: Schema.String.check(SchemaCheck.minLength(3)),
  age: Schema.Number.check(SchemaCheck.greaterThanOrEqualTo(18)),
})

const defaultSchema = Schema.standardSchemaV1(schema, {
  leafHook: (issue) => {
    return Match.value(issue).pipe(
      Match.tag('Forbidden', () => 'Forbidden value'),
      Match.tag('InvalidType', () => 'Invalid type'),
      Match.tag('InvalidValue', () => 'Value is invalid'),
      Match.tag('MissingKey', () => 'Mate, you forget something'),
      Match.tag('OneOf', () => 'This is not a valid option'),
      Match.exhaustive
    )
  },
  checkHook: (issue) => {
    const meta = issue.check.annotations?.meta

    // having the meta values linked to the id is too much?
    switch (meta?.id) {
      case 'minLength':
        return `This is too short: ${meta.minLength} characters at least`
      case 'greaterThanOrEqualTo':
        return `You should be at least ${meta.minimum} years old`
      default:
        return 'Something went horribly wrong'
    }
  }
})


const form = useForm({
  onSubmit: async ({ value }) => {
    console.log(value)
  },
  validators: {
    onSubmit: defaultSchema,
  },
})

interface Acc {
  kind: string;
  meta: any;
}
const generation = (ast?: AST, {
  meta = {} as Record<string, any>,
  propertySignatures = [] as readonly PropertySignature[],
} = {}, acc = {} as Acc): Acc => {
  if (ast) {
    return Match.value(ast).pipe(
      Match.tag('TypeLiteral', (a) => generation(undefined, {
        meta,
        propertySignatures: a.propertySignatures,
      }, acc)),
      Match.tag('StringKeyword', (a) => {
        return {
          kind: 'string',
          meta: a.checks?.reduce((accr, check) => ({...accr, ...check.annotations?.meta || {}}), {})
        }
      }),
      Match.tag('NumberKeyword', (a) => {
        return {
          kind: 'number',
          meta: a.checks?.reduce((accr, check) => ({...accr, ...check.annotations?.meta || {}}), {})
        }
      }),
      Match.tag('BooleanKeyword', (a) => {
        return {
          kind: 'boolean',
          meta: a.checks?.reduce((accr, check) => ({...accr, ...check.annotations?.meta || {}}), {})
        }
      }),
      Match.tag('BigIntKeyword',
        'NullKeyword',
        'UndefinedKeyword',
        'NeverKeyword',
        'AnyKeyword',
        'SymbolKeyword',
        'LiteralType',
        'UniqueSymbol',
        'ObjectKeyword',
        'Enums',
        'TemplateLiteral',
        'Declaration',
        'Suspend',
        'TupleType', 'UnionType', 'UnknownKeyword', 'VoidKeyword', () => {
          throw new Error('Not implemented yet')
        }),
      Match.exhaustive
    )
  }
  for(const propertySignature of propertySignatures) {
    Object.assign(acc, {
      [propertySignature.name]: generation(propertySignature.type, {
        meta,
      }, acc),
    })
  }
  return acc
}

console.log(generation(schema.ast))

</script>

<template>
  <form @submit.prevent="form.handleSubmit">
    <div v-for="input in Object.entries(generation(schema.ast))">
      <form.Field :name="input[0]">
        <template #default="{ field, state }">
          <label :for="field.name">{{ field.name }}</label>
          <input :id="field.name" :name="field.name" :value="field.state.value" :type="input[1].kind" :minlength="input[1].meta?.minLength" :maxlength="input[1].meta?.maxLength" :min="input[1].meta?.minimum" :max="input[1].meta?.maximum"
            @input="field.handleChange(($event.target as HTMLInputElement)[input[1].kind === 'number' ? 'valueAsNumber' : 'value'])" />
          <FieldState :state="state" />
        </template>
      </form.Field>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

button {
  margin-top: 1rem;
}
</style>
