<template>
	<div class="phoenix-mask" 
		:class="{ 'hide' : !show, 'transparent' : transparent }"></div>
</template>
<script>

	export default {
		name : 'mask',
		props : {
			show : {
				type : Boolean,
				default : false	
			},
			transparent : {
				type : Boolean,
				default : false
			}
		}
	}
</script>
<style lang="less" scoped>
	.phoenix-mask {
		width: 100%; 	
		height: 100%;
		position: fixed;	
		left:0;
		top:0;
		z-index: 9999;
		background:rgba(55,55,55,.6);	

		&.hide {
			display: none;
		}

		&.transparent {
			opacity: 0 !important;
		}
	}
</style>