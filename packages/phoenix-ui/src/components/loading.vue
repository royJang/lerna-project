<template>
  <mask :transparent="true" :show="show"></mask>
	<layer :show="show" 
           :style="{ 
                'width' : '100px',
                'height' : '100px',
                'background-color' : 'rgba(0,0,0,0.6)'
           }">
	    <div class="phoenix-loading">
          <div></div>
          <div></div>      
      </div>
	</layer>
</template>	
<script>    

	import layer from './layer.vue';
	import mask from './mask.vue';

	export default {
		name : 'loading',	  
		props : {	
			show : {
				type : Boolean, 
				twoWay : true	
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

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.infinite,
.phoenix-loading {
  animation-iteration-count: infinite;
}

.phoenix-loading {
  border:5px solid #fff;
  border-left-color:transparent;
  width:40px; height:40px;
  border-radius: 50%;
  animation-fill-mode:both;
  animation-duration:.7s;
  animation-name:loading7keyframes;
  animation-timing-function:linear;
  margin:30px auto;
}

@keyframes loading7keyframes{
  from {
    transform:rotateZ(0turn);
  }
  to {
    transform:rotateZ(1turn);
  }
}

</style>