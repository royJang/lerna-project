<template>
	<mask :show="show" :transparent="true"></mask>
	<layer :show="show">
		<div class="toast-content">
			<div class="bg"></div>
			<div class="text">
				<slot></slot>
			</div>	
		</div>
	</layer>
</template>	
<script>

	import layer from './layer.vue';
	import mask from './mask.vue';

	let timer = null;

	export default {
		name : 'toast',	
		props : {	
			show : {
				type : Boolean,
				twoWay : true
			},
			duration : {
				type : Number,
				default : 1500
			}
		},
		watch : {
			show ( value ){
				if( timer ) clearTimeout( timer );
				timer = setTimeout(() => {
					this.show = false;
				}, this.duration);
			}
		},
		components : [
			layer,
			mask
		],	
		methods : {
		}
	}	

</script>
<style lang="less" scoped>
	.toast-content {
		position: relative; background: rgba(3, 3, 3, .7); border-radius: 3px;
		.bg {
			position: absolute;
			left:0; top:0; border-radius: 3px; width: 100%; height:100%;
			z-index: -1;
		}
		.text {
			word-wrap:break-word; line-height: 22px;
			text-align: center; padding:15px; color:#fff;
			font-size: 14px;
		}
	}
</style>