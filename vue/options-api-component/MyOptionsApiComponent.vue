<template>
    <div class="my-class-component">
        <my-options-api-component-child ref="child" />
    </div>
</template>

<script lang="ts">
    import { Moment } from 'moment'
    import Vue, { PropType } from 'vue'

    import MyOptionsApiComponentChild, { IMyOptionsApiComponentChild } from './MyOptionsApiComponentChild.vue'

    interface IProp4 {
        arg1: number
        arg2: null | string
    }

    type Data = {
        data1: Moment | null
        data2: string
        data3: number
        readonly data4: number
    }

    export default Vue.extend({
        name: 'MyOptionsApiComponent',
        components: {
            MyOptionsApiComponentChild,
        },
        props: {
            prop1: {
                type: Boolean,
                default: true,
            },
            prop2: {
                type: String,
                default: 'option 1',
                validator: (value: string) => ['option 1', 'option 2'].includes(value),
            },
            prop3: {
                type: String,
                default: 'option 1',
            },
            prop4: {
                type: Object as PropType<IProp4>,
                default: undefined,
            },
        },
        data (): Data {
            return {
                data1: null,
                data2: 'my string',
                data3: 0,
                data4: 123,
            }
        },
        computed: {
            refChild: {
                cache: false,
                get (): InstanceType<typeof IMyOptionsApiComponentChild> {
                    return this.$refs.child as InstanceType<typeof IMyOptionsApiComponentChild>
                },
            },
            computedProp1 (): number {
                return this.data1!.hour() + 1
            },
            computedProp2 (): number {
                return this.data1!.minute() + this.data4
            },
        },
        watch: {
            data1: {
                handler (): void {
                    this.data3++
                },
            },
            data2: {
                handler (newVal: string, oldVal: string): void {
                    this.data3++
                },
                immediate: true,
                deep: true,
            },
        },
        beforeCreate (): void {
            console.warn('beforeCreate')
        },
        created (): void {
            console.warn('created')
        },
        beforeMount (): void {
            console.warn('beforeMount')
        },
        mounted (): void {
            console.warn('mounted')
        },
        beforeDestroy (): void {
            console.warn('beforeDestroy')
        },
        destroyed (): void {
            console.warn('destroyed')
        },
        beforeUpdate (): void {
            console.warn('beforeUpdate')
        },
        updated (): void {
            this.refChild.method1(this.data4)
        },
        methods: {
            emitEvent1 (): void {
                this.$emit('event1')
            },
            emitEvent2 (arg1: string, arg2: number): void {
                this.$emit('event2', arg1, arg2)
            },
            emitEvent3 (arg1: string): number {
                this.$emit('event3', arg1)
                return this.data3
            },
            method1 (): void {
                this.emitEvent1()
            },
            method2 (arg1: number, arg2: string | null): string {
                return this.data1 + this.data2
            },
        },
    })
</script>
