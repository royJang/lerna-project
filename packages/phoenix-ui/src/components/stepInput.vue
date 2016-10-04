<template>
	<div class="phoenix-step-input">
		<span class="step left" @click="decrease">-</span>
		<input type="text" v-model="val" @blur="update">
		<span class="step right" @click="increase">+</span>
	</div>
</template>
<style lang="less">
	.phoenix-step-input {
		display: inline-flex;
		.step {
		    padding: 6px 12px;
		    font-size: 15px; font-weight: bold; text-align: center;
		    color: #333; background-color: #eee;
		    line-height: 1; border: 1px solid #ccc;
		    user-select: none; cursor: pointer;
		    &.left { border-top-left-radius: 3px; border-bottom-left-radius: 3px; border-right: none; }
		    &.right { border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-left: none; }
		    &:hover { border-color: #aaa; background-color: #ddd; }
		    &:active { background-color: #ccc; }
		}
		input {
		    padding: 6px 12px; margin: 0;
		    font-size: 14px;
		    color: #555; background-color: #fff; border: 1px solid #ccc;
		    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
		    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
		    user-select: text; outline: none;
		    &:focus {  
			  	border-color: #66afe9;
	          	box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
		    }
		}
	}
</style>
<script>
	// import _ from 'lodash/util';
	let verfiyReg = /^([1-9]|-|0(?=\.?))[\d|\.]*/;

	export default {
		name: 'stepInput',
		props: {
			// name: {
			// 	type: String,
			// 	default () { return _.uniqueId('step_input_') }
			// },
			min: {
				type: Number,
				required: true
			},
			max: {
				type: Number,
				required: true
			},
			step: {
				type: Number,
				required: true
			},
			value: {
				type: Number,
				default: 0,
				twoWay: true
			}
		},
		data() {
			return {
				val: ''
			}
		},
		ready() {
			this.val = this.value.toString();
			this.$watch('val', (v) => {
				this.$nextTick(() => {
					let matched = v.match(verfiyReg);
					if (matched) {
						this.val = matched[0];
					} else {
						this.val = '';
					}
				});
			});
		},
		methods: {
			update() {
				this.$nextTick(() => {
					let v = parseFloat(this.val);
					// 如果不是数字，或者超出范围，就恢复原来的数值
					if (isNaN(v) || v < this.min || v > this.max) {
						this.val = this.value.toString();
					} else {
						this.value = v;
					}
				});
			},
			// floats计算, 以当前value小数位fixed 
			decrease() {
				let r = 0;
				if (this.value % 1 !== 0) {
					r = this.value.toString().split('.')[1].length;
				}

				let v = (this.value - this.step).toFixed(r) / 1;
				if (v <= this.min) return;

				this.value = v;
				this.val = this.value.toString();
			},
			increase() {
				let r = 0;
				if (this.value % 1 !== 0) {
					r = this.value.toString().split('.')[1].length;
				}

				let v = (this.value + this.step).toFixed(r) / 1;
				if (v >= this.max) return;

				this.value = v
				this.val = this.value.toString();
			}
		}

	}
</script>
