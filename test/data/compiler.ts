export const TEST_CLASS_COMPONENT_CODE =
`import { Component, Prop, Vue, Ref, Emit, Watch, Mixins } from 'vue-property-decorator'
import NestedComponent from './NestedComponent.vue'
// comment C
import AnotherNestedComponent from './NestedComponent.vue'
// comment A
// comment B
import MyMixin from './MyMixin.vue'

interface MyInterface {
    myProperty: string
}

type CenasType = 'cenas' | 'outra cena' | 'outra cenas qualquer'

/**
 * Component decorator
 * See https://github.com/kaorun343/vue-property-decorator
 */
@Component({
    components: {
        NestedComponent,
        AnotherNestedComponent,
    },
})
export default class ExampleComponent extends Mixins(MyMixin) {
    // Refs
    @Ref('myDiv')
    readonly myDiv!: HTMLDivElement

    @Ref('myOtherDiv')
    myOtherDiv!

    // Default Boolean Prop
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

    // data
    readonly MY_CONST: number = 123
    myDataOne: string = 'cenas'
    private myPrivateData = 'more stuff'

    // Watch
    @Watch('myDataOne', { immediate: true, deep: true })
    onMyDataOne(newVal: string, oldVal:string) {
        const dummy = 'dummy'
        console.log(\`changed from \${oldVal} to \${newVal}!\`)
    }

    // Emits 'my-event'
    @Emit('my-event')
    emitMyEvent (): void {}

    @Emit('my-event-with-payload-param')
    emitMyEventWithPayloadParam (num: number): void {}

    @Emit('my-event-with-payload-return')
    emitMyEventWithPayloadReturn (num: number): MyObject {
        const myPropertyValue = 4 * num

        return {
            myProperty: myPropertyValue,
        }
    }

    // hooks
    beforeCreate (): void {
        console.log('beforeCreated')
    }

    created (): void {
        console.log('created')
    }

    beforeMount(): void {
        console.log('beforeMount')
    }

    mounted () {
        console.log('mounted')
    }

    beforeUpdate (): void {
        console.log('beforeUpdate')
    }

    updated() {
        console.log('updated')
    }

    beforeUnmount (): void {
        console.log('beforeUnmount')
    }

    unmounted() {
        console.log('unmounted')
    }

    // comment A
    get myDataOneUppercase () {
        // comment C
        return this.myDataOne.toUpperCase() // comment D
    }

    /**
     * JSDOC block
     *
     * logSomething logs something
     * @param something
     */
    logSomething (something: any): void {
        console.log(something)
    }

    // Does math
    doMath(a: number, b: number): number {
        return a + b
    }

    doSomethingWithRef() {
        this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
    }

    /**
     * JSDOC block
     *
     * emitAllTheThings emits all the things
     */
    emitAllTheThings (): void {
        this.emitMyEvent()
        this.emitMyEventWithPayloadParam(2)
        this.emitMyEventWithPayloadReturn(2)
    }
}
`
/**
 * Code is generated in the following order (from "code-generator.ts")
 * 1. imports
 * 2. types
 * 3. interfaces
 * 4. component
 *    4.1. name
 *    4.2. imported components
 *    4.3. mixins
 *    4.4. props
 *    4.5. data
 *    4.6. lifecycle hooks
 *    4.7. watch
 *    4.8. computed
 *      4.8.1. regular getters/computed
 *      4.8.2. refs
 *      4.8.3. readonly data
 *    4.9. methods
 *      4.9.1. regular methods
 *      4.9.2. emits
 *      4.9.3. watch handlers
 */
export const TEST_OPTIONS_COMPONENT_CODE =
`import type { PropType } from 'vue'
import { defineComponent } from 'vue'

// comment A
// comment B
import MyMixin from './MyMixin.vue'
import NestedComponent from './NestedComponent.vue'
// comment C
import AnotherNestedComponent from './NestedComponent.vue'

type CenasType = 'cenas' | 'outra cena' | 'outra cenas qualquer'

interface MyInterface {
    myProperty: string
}

type Data = {
    readonly MY_CONST: number
    myDataOne: string
    myPrivateData: any
}

/**
 * Component decorator
 * See https://github.com/kaorun343/vue-property-decorator
 */
export default defineComponent({
    name: 'ExampleComponent',

    components: {
        NestedComponent,
        AnotherNestedComponent,
    },

    mixins: [MyMixin],

    props: {
        // Default Boolean Prop
        defaultBoolean: {
            type: Boolean as PropType<boolean>,
            default: true,
        },
        defaultProp: {
            type: String as PropType<'option 1' | 'option 2'>,
            default: 'option 1',
        },
        requiredStringProp: {
            type: String as PropType<string>,
            required: true,
        },
        notRequiredStringProp: {
            type: String as PropType<string>,
        },
        objectProp: {
            type: Object as PropType<MyInterface>,
        },
        validatedProp: {
            type: String as PropType<string>,
            default: 'cenas',
            validator: (prop) => typeof prop === 'string' || prop === null,
        },
    },

    emits: {
        // Emits 'my-event'
        'my-event': () => true,
        'my-event-with-payload-param': (num: number) => true,
        'my-event-with-payload-return': (arg: MyObject, num: number) => true,
    },

    data (): Data {
        return {
            MY_CONST: 123,
            myDataOne: 'cenas',
            myPrivateData: 'more stuff',
        }
    },

    computed: {
        // comment A
        myDataOneUppercase (): TODO /** TODO: Add the missing return type. Otherwise, the build may fail. */ {
            // comment C
            return this.myDataOne.toUpperCase() // comment D
        },
    },

    watch: {
        'myDataOne': {
            handler: 'onMyDataOne',
            immediate: true,
            deep: true,
        },
    },

    beforeCreate (): void {
        console.log('beforeCreated')
    },
    created (): void {
        console.log('created')
    },
    beforeMount (): void {
        console.log('beforeMount')
    },
    mounted (): void {
        console.log('mounted')
    },
    beforeUpdate (): void {
        console.log('beforeUpdate')
    },
    updated (): void {
        console.log('updated')
    },
    beforeUnmount (): void {
        console.log('beforeUnmount')
    },
    unmounted (): void {
        console.log('unmounted')
    },

    methods: {
        getMyDiv (): InstanceType<typeof HTMLDivElement> {
            return this.$refs.myDiv as InstanceType<typeof HTMLDivElement>
        },
        getMyOtherDiv () {
            return this.$refs.myOtherDiv
        },
        /**
         * JSDOC block
         *
         * logSomething logs something
         * @param something
         */
        logSomething (something: any): void {
            console.log(something)
        },
        // Does math
        doMath (a: number, b: number): number {
            return a + b
        },
        doSomethingWithRef () {
            this.getMyDiv().addEventListener('click', () => this.logSomething(this.doMath(1, 1)))
        },
        /**
         * JSDOC block
         *
         * emitAllTheThings emits all the things
         */
        emitAllTheThings (): void {
            this.emitMyEvent()
            this.emitMyEventWithPayloadParam(2)
            this.emitMyEventWithPayloadReturn(2)
        },
        emitMyEvent (): void {
            this.$emit('my-event')
        },
        emitMyEventWithPayloadParam (num: number): void {
            this.$emit('my-event-with-payload-param', num)
        },
        emitMyEventWithPayloadReturn (num: number): void {
            const myPropertyValue = 4 * num

            this.$emit('my-event-with-payload-return', {
                myProperty: myPropertyValue,
            }, num)
        },
        // Watch
        onMyDataOne (newVal: string, oldVal: string) {
            const dummy = 'dummy'
            console.log(\`changed from \${oldVal} to \${newVal}!\`)
        },
    },
})
`
