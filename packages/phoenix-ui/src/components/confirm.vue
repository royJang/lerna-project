<template>
	<mask :show="show"></mask>
	<layer :show="show">
		<div class="phoenix-confirm">
			<div class="text">
				<slot></slot>
			</div>
			<div class="btns">
				<div class="btn" @click="this.show = false;">取消</div>
				<div class="btn btn-submit" @click="submit">{{ btn }}</div>
			</div>
		</div>
	</layer>
</template>	
<script>
		
	import mask from './mask.vue';
	import layer from './layer.vue';

	export default {
		name : 'confirm',	
		props : {	
			'show' : {
				type : Boolean,
				default : false,	
				twoWay : true
			},
			'btn' : {
				type : String,
				default : '确定'
			},
			onSubmit : {
				type : Function
			}
		},
		components : [
			mask,
			layer
		],
		watch : {
			show ( value ) {
				this.show = value;
			}
		},
		methods : {
			submit (){
				this.onSubmit && this.onSubmit();
			}
		}
	}	

</script>
<style lang="less" scoped>
	.text { 
		padding:15px; line-height: 22px; word-wrap:break-word; 
		font-size: 14px;
	}
	.btns {
		width:100%; height:40px; line-height: 40px; cursor: pointer;
		border-top:1px solid #eee; color:#09f; font-size: 14px; box-sizing: border-box;
		.btn-submit {
			font-weight: bold; border-left:1px solid #eee;
			box-sizing: border-box;
		}
		.btn { 
			width:50%; float: left; 
			&:hover {
				text-shadow:2px 1px 5px #ccc;
			}
		}
	}
</style>