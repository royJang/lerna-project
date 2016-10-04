<template>
	<div class="phoenix-img-preview" 
		:style="{ height: height + 'px', width: width + 'px' }">
		<img :src="imgData" alt="">
	</div>
</template>
<style lang="less">
	.phoenix-img-preview {
		padding: 4px;
		margin-bottom: 8px;
	    background-color: #fff;
	    border: 1px solid #ccc;
	    border-radius: 4px;
	    img {
	    	height: 100%;
    		width: 100%;
    		border: none;
    		vertical-align: middle;
	    }
	}
</style>
<script>
	export default {
		name: 'imgPreview',
		props: {
			value: {
				type: File
			},
			height: {
				tyle: Number,
				default: 80
			},
			width: {
				tyle: Number,
				default: 80
			}
		},
		data() {
			return {
				imgData: ''
			}
		},
		ready() {
			this.$nextTick(() => {
				if (!this.value) return;

				let reader = new FileReader();
				reader.onload = (e) => {
					this.imgData = e.target.result;
				}
				reader.readAsDataURL(this.value);
			});
		},
		methods: {

		}
	}
</script>