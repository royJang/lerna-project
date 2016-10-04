<template>
	<div v-if="show" 
		 transition="expand"
		 class="phoenix-layer"
		 v-el="layer"
		 :style="style"
		 :class="{
		    'size-large' : size === 'large',
		    'size-small' : size === 'small' }">

		<slot></slot>	
	</div>
</template>	
<script>

	export default {
		name : 'layer',
		props : {
			show : {
				type : Boolean,
				default : false
			},
			style : {
				type : Object,
			},
			size : {
				type : String,
				default : 'small',
				validator ( value ){
					return ['large', 'small'].indexOf( value ) > -1;
				}
			}
		}
	}
</script>
<style lang="less" scoped>	
	.phoenix-layer {
		position: fixed;
		width:260px; z-index: 10000; top:50%; left:50%;
		border-radius: 3px; background: #fff;  
		box-shadow: 2px 1px 5px #555; 
		transform: translate(-50%, -50%);
		transform-origin:-25% -25%;	
		text-align: center;

		&.size-large { width:520px; }
		&.size-small { width:260px; }
	}
	.expand-transition {
	  animation-fill-mode: both;
	}	

	.expand-enter  {
	  animation:zoomIn .3s;
	}

	.expand-leave {	
	   animation:zoomOut .3s;
	}

	@keyframes zoomIn {
	  0% {
	    opacity: 0;
	    transform: scale3d(0.3, 0.3, 0.3);
	  }
	  50% {
	    opacity: 1;
	  }
	}

	@keyframes zoomOut {
	  0% {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0;
	    transform: scale3d(0.3, 0.3, 0.3);
	  }
	  100% {
	    opacity: 0;
	  }
	}
		
</style>