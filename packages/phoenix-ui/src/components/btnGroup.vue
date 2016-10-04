<template>
	<div class="phoenix-btn-group">
		<slot></slot>
	</div>
</template>
<script type="text/javascript">

	import _ from 'lodash/util';

	export default {
		name : 'btn-group',
		props : {
			group : {
				type : String,
				default (){
					return _.uniqueId('btn_group_');
				}	
			},
			value : {
				type : [ String, Array ],
				twoWay : true
			}
		},
		created (){
			this.$on('updateValue', ( options ) => {
				if( options.type === "radio" ){
					this.value = options.value;
				}
				else if( options.type === "checkbox" ) {
					//添加操作
					if( options.push ){
						this.value.push( options.value );
					}
					//删除操作	
					else {	
						this.value.splice( this.value.indexOf( options.value ), 1);
					}
				}
			});
		}	
	}
</script>
<style lang="less">
</style>