<template>
    <div ref="myDiv" />
</template>

<script lang="ts">
    import { Component, Prop, Vue, Ref, Emit, Watch, mixins } from 'vue-property-decorator'
    import NestedComponent from './NestedComponent.vue'
    import AnotherNestedComponent from './NestedComponent.vue'
    import MyMixin from './MyMixin.vue'

    interface MyInterface {
        myProperty: string
    }

    // https://github.com/kaorun343/vue-property-decorator
    @Component({
        components: {
            NestedComponent,
            AnotherNestedComponent,
        },
    })
    export default class ExampleComponent extends mixins(MyMixin) {
        // Refs
        @Ref('myDiv')
        readonly myDiv!: HTMLDivElement

        // Props
        @Prop({ type: Boolean, default: true })
        public readonly defaultBoolean!: boolean

        @Prop({ type: String, default: 'option 1' })
        public readonly defaultProp!: 'option 1' | 'option 2'

        @Prop({ type: String, required: true })
        public readonly requiredStringProp!: string

        @Prop({ type: String, required: false })
        public readonly notRequiredStringProp?: string

        @Prop({ type: Object })
        public readonly objectProp?: MyInterface


        // data
        readonly MY_CONST: number = 123
        myDataOne = 'cenas'
        private myPrivateData = 'more stuff'

        // Watch
        @Watch('myDataOne', { immediate: true, deep: true })
        onMyDataOne(newVal: string, oldVal:string) {
            console.log(`changed from ${oldVal} to ${newVal}!`)
        }

        // Emits
        @Emit('my-event')
        emitMyEvent (): void {}

        @Emit('my-event-with-payload-param')
        emitMyEventWithPayloadParam (num: number): void {}

        // hooks
        beforeCreate() {
            console.log('beforeCreated')
        }

        created() {
            console.log('created')
        }

        beforeMount() {
            console.log('beforeMount')
        }

        mounted() {
            console.log('mounted')
        }

        beforeUpdate() {
            console.log('beforeUpdate')
        }

        updated() {
            console.log('updated')
        }

        beforeUnmount() {
            console.log('beforeUnmount')
        }

        unmounted() {
            console.log('unmounted')
        }

        // computed
        get myDataOneUppercase () {
            return this.myDataOne.toUpperCase()
        }

        // methods
        logSomething (something: any): void {
            console.log(something)
        }

        doMath(a: number, b: number): number {
            return a + b
        }

        doSomethingWithRef() {
            this.myDiv.addEventListener('click', () => this.logSomething(this.doMath(1,1)))
        }

        emitAllTheThings (): void {
            this.emitMyEvent()
            this.emitMyEventWithPayloadParam(2)
            this.emitMyEventWithPayloadReturn(2)
        }
    }
</script>

<style lang="scss">
</style>
