import { SyntaxKind, PropertyDeclaration, Project } from 'ts-morph'
import { DUMMY_TEST_FILE, TestCase } from '.'
import { Prop } from '../../src/compiler/structures'

const TEST_CLASS_COMPONENT_CODE =
`export default class ExampleComponent extends mixins(MyMixin) {
  @Prop({ type: Boolean, default: true })
  public defaultBoolean!: boolean

  @Prop({ type: String, default: 'option 1' })
  public readonly defaultProp!: 'option 1' | 'option 2'

  @Prop({ type: String, required: true })
  public readonly requiredStringProp!: string

  @Prop({ type: String, required: false })
  public readonly notRequiredStringProp?: string

  @Prop({ type: Object })
  public readonly objectProp?: MyInterface

  @Prop({ type: String, validator: (prop) => typeof prop === 'string' || prop === null, required: false, default: 'cenas' })
  public validatedProp: string

  @Prop({ type: String, required: false, default: null })
  public stringOrNullProp!: string | null

  @Prop()
  untypedProp
}
`
const [ defaultBooleanNode, defaultPropNode, requiredStringPropNode, notRequiredStringPropNode, objectPropNode, validatedPropNode, stringOrNullPropNode, untypedPropNode] = new Project()
  .createSourceFile(DUMMY_TEST_FILE,TEST_CLASS_COMPONENT_CODE)
  .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)

/**
@Prop({ type: Boolean, default: true })
public defaultBoolean!: boolean
*/
const defaultBooleanOptionsCode =
`defaultBoolean: {
    type: Boolean as PropType<boolean>,
    default: true,
},
`

const defaultBooleanTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: defaultBooleanNode,
  code: defaultBooleanOptionsCode,
  structure: {
    name: 'defaultBoolean',
    isReadonly: false,
    isRequired: false,
    propType: 'Boolean',
    nativeType: 'boolean',
    defaultValue: 'true',
    structure: {
      name: 'defaultBoolean',
    },
  },
  description: 'should generate not required boolean prop with default value',
}

/**
@Prop({ type: String, default: 'option 1' })
public readonly defaultProp!: 'option 1' | 'option 2'
*/
const optionsPropDefaultProp =
`defaultProp: {
    type: String as PropType<'option 1' | 'option 2'>,
    default: 'option 1',
},
`

const defaultPropTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: defaultPropNode,
  code: optionsPropDefaultProp,
  structure: { name: 'defaultProp', isReadonly: true, isRequired: false, propType: 'String', nativeType: '\'option 1\' | \'option 2\'', defaultValue: '\'option 1\'', structure: { name: 'defaultProp' } },
  description: 'should generate not required string union prop with default value',
}

/**
@Prop({ type: String, required: true })
public readonly requiredStringProp!: string
*/
const requiredStringPropOptionsCode =
`requiredStringProp: {
    type: String as PropType<string>,
    required: true,
},
`

const requiredStringPropTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: requiredStringPropNode,
  code: requiredStringPropOptionsCode,
  structure: { name: 'requiredStringProp', isReadonly: true, isRequired: true, propType: 'String', nativeType: 'string', structure: { name: 'requiredStringProp' } },
  description: 'should generate required string prop',
}

/**
@Prop({ type: String, required: false })
public readonly notRequiredStringProp?: string
*/
const notRequiredStringPropOptionsCode =
`notRequiredStringProp: {
    type: String as PropType<string>,
},
`

const notRequiredStringPropTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: notRequiredStringPropNode,
  code: notRequiredStringPropOptionsCode,
  structure: { name: 'notRequiredStringProp', isReadonly: true, isRequired: false, propType: 'String', nativeType: 'string', structure: { name: 'notRequiredStringProp' } },
  description: 'should generate not required string prop',
}
/**
@Prop({ type: Object })
public readonly objectProp?: MyInterface
*/
const objectPropOptionsCode =
`objectProp: {
    type: Object as PropType<MyInterface>,
},
`

export const propObjectPropTestStructure: TestCase<PropertyDeclaration, Prop> = {
  node: objectPropNode,
  code: objectPropOptionsCode,
  structure: { name: 'objectProp', isReadonly: true, isRequired: false, propType: 'Object', nativeType: 'MyInterface', structure: { name: 'objectProp' } },
  description: 'should generate not required object prop with interface as PropType',
}

/**
@Prop({ type: String, validator: (prop) => typeof prop === 'string' || prop === null, required: false, default: 'cenas' })
public validatedProp: string
*/
const validatedPropOptionsCode =
`validatedProp: {
    type: String as PropType<string>,
    default: 'cenas',
    validator: (prop) => typeof prop === 'string' || prop === null,
},
`

const validatedPropNodeTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: validatedPropNode,
  code: validatedPropOptionsCode,
  structure: { name: 'validatedProp', isReadonly: false, isRequired: false, propType: 'String', nativeType: 'string', validator: '(prop) => typeof prop === \'string\' || prop === null', defaultValue: '\'cenas\'', structure: { name: 'validatedProp' } },
  description: 'should generate not required string prop with default value and custom validator',
}

const stringOrNullPropCode =
`stringOrNullProp: {
    type: String as PropType<string | null>,
    default: null,
},
`

const stringOrNullPropNodeTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: stringOrNullPropNode,
  code: stringOrNullPropCode,
  structure: { name: 'stringOrNullProp', isReadonly: false, isRequired: false, propType: 'String', nativeType: 'string | null', structure: { name: 'stringOrNullProp' } },
  description: 'should generate prop with multiple types',
}

/**
@Prop()
untypedProp
*/

const untypedPropCode =
`untypedProp: {
},
`

const untypedPropNodeTestCase: TestCase<PropertyDeclaration, Prop> = {
  node: untypedPropNode,
  code: untypedPropCode,
  structure: { name: 'untypedProp', isReadonly: false, isRequired: false, nativeType: 'any', structure: { name: 'untypedProp' } },
  description: 'should generate untyped prop',
}

export const PROP_TEST_CASES = [
  defaultBooleanTestCase,
  defaultPropTestCase,
  requiredStringPropTestCase,
  notRequiredStringPropTestCase,
  validatedPropNodeTestCase,
  stringOrNullPropNodeTestCase,
  untypedPropNodeTestCase,
] as const
