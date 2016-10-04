/**
 * 
 * @param {Boolean} show.sync - 显示 or 隐藏组件
 */

<template>
	<mask :show="show"></mask>
	<layer :show="show">
		<div class="phoenix-alert">
			<div class="text">
				<slot></slot>
			</div>		
			<div class="btn" @click="this.show = false;">我知道了</div>
		</div>
	</layer>
</template>
<script>

	import mask from './mask.vue';
	import layer from './layer.vue';
	
	export default {
		name : 'alert',
		props : {
			show : {
				type : Boolean,
				default : false,
				twoWay : true	
			}
		},
		components : [
			mask,
			layer
		],	
		watch : {
			show ( value ){
				this.show = value;
			}
		}
	}

</script>
<style lang="less" scoped>
	.text { 
		padding:15px; line-height: 22px; word-wrap:break-word; 
		font-size: 14px;
	}
	.btn {
		width:100%; height:40px; line-height: 40px; cursor: pointer;
		border-top:1px solid #eee; color:#09f; font-size: 14px;
		&:hover {
			text-shadow:2px 1px 5px #ccc;
		}
	}
</style>