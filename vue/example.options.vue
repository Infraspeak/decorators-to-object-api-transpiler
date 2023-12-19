<template>
    <div ref="myDiv" />
</template>

<script lang="ts">
    import Vue, { PropType } from 'vue'
    import NestedComponent from './NestedComponent.vue'
    import AnotherNestedComponent from './NestedComponent.vue'
    import MyMixin from './MyMixin.vue'

    interface MyInterface {
        myProperty: string
    }

    export default Vue.extend({
        name: 'ExampleComponent',

        components: {
            NestedComponent,
            AnotherNestedComponent,
        },

        mixins: [MyMixin],

        props: {
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
                required: false,
            },
            objectProp: {
                type: Object as PropType<MyInterface>,
                required: false,
            },
        },

        data() {
            return {
                myDataOne: 'cenas',
                myPrivateData: 'more stuff',
            }
        },

        beforeCreate() {
            console.log('beforeCreated')
        },

        created() {
            console.log('created')
        },

        beforeMount() {
            console.log('beforeMount')
        },

        mounted() {
            console.log('mounted')
        },

        beforeUpdate() {
            console.log('beforeUpdate')
        },

        updated() {
            console.log('updated')
        },

        beforeUnmount() {
            console.log('beforeUnmount')
        },

        unmounted() {
            console.log('unmounted')
        },

        watch: {
            myDataOne: {
                immediate: true,
                deep: true,
                handler: 'onMyDataOne',
            },
        },

        computed: {
            // refs
            myDiv: {
                cache: false,
                get(): HTMLDivElement {
                    return this.$refs.myDiv as HTMLDivElement
                }
            },
            myDataOneUppercase () {
                return this.myDataOne.toUpperCase()
            },
            MY_CONST(): number {
                return 123
            }
        },

        methods: {
            // Emits
            emitMyEvent (): void {
                this.$emit('my-event')
            },
            emitMyEventWithPayloadParam (num: number): void {
                this.$emit('my-event-with-payload-param', num)
            },
            // Methods
            logSomething (something: any): void {
                console.log(something)
            },

            doMath(a: number, b: number): number {
                return a + b
            },

            doSomethingWithRef() {
                this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
            },

            emitAllTheThings (): void {
                this.emitMyEvent()
                this.emitMyEventWithPayloadParam(2)
                this.emitMyEventWithPayloadReturn(2)
            },
            // watch methods
            onMyDataOne(newVal: string, oldVal:string) {
                console.log(`changed from ${oldVal} to ${newVal}!`)
            }
        }
    })
</script>

<style lang="scss">
</style>
