<template>
	<div class="phoenix-progress" :style='{ "width" : width }'>
		<div class="percent" :class="{ 'white' : value >= 60 }">{{ value }}%</div>
		<div class="phoenix-progress-percent" 
			:style='{ "width" : value + "%" }'>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		name : 'progressBar',
		props : {
			value : {
				type : Number,
				default : 0,
				coerce ( val ){
					return ~~val;
				}
			},
			width : {
				type : String,
				default : '200px'
			}
		}
	}
</script>
<style lang="less">
	.phoenix-progress {
		position: relative; overflow: hidden;
	    background-color: #f5f5f5; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); 
	    border-radius: 4px; height:20px; display: inline-block;

		.phoenix-progress-percent {
			background: #337ab7; position: absolute; left:0; top:0; height:20px;
			transition: width .6s ease; z-index: 1; border-radius:4px;
		}
		.percent {
			text-align: center; position: absolute; left:0; top:0; width:100%;
			color:#333; z-index: 2; line-height: 20px; font-size: 12px;
			&.white {
				color:#fff !important;
			}
		}
	}
</style>