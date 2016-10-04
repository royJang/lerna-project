<template>
	<label class="phoenix-radio">
		<input type="radio" 
			   name="{{ group }}" 
			   checked="{{ checked }}"
			   class="phoenix-radio-origin"	
			   value="{{ value }}"
			   @change.prevent="updateValue( this.value )"
			   />

		<div class="radio-group">
			<div class="radio-btn"></div>
			<div class="radio-content">
				<slot></slot>
			</div>
		</div>
	</label>	
</template>	
<script>
	export default {
		name : 'radio',	
		props : {	
			group : {
				type : String
			},
			checked : {
				type : [ Boolean, String ]
			},
			value : {
				type : String	
			}
		},
		created (){
			//group都由父级定义
			if( this.$parent && this.$parent.group ) {	
				this.group = this.$parent.group;	
			} else {
				throw new Error('<radio>的父级必须是一个<btn-group>');
			}

			//将属性checked为true的结果设为当前group的 value
			if( this.checked ){
				this.updateValue( this.value );
			}
		},
		methods : {
			updateValue ( e ){
				this.$dispatch('updateValue', {
					type : 'radio',
					value : this.value
				});
			}
		}
	}	
</script>
<style lang="less" scoped>

	.phoenix-radio {
		display: inline-block;
	}
	.radio-group {
		display: flex;
	}
	.radio-btn {
		width:16px; height:16px; border-radius: 50%; 
		background: #eee; align-self:center;
		border:1px solid #ddd;
	}
	.radio-content {
		vertical-align: middle; text-indent: 5px;
	}
	.phoenix-radio-origin {
		display: none;
		&:checked ~ .radio-group > .radio-btn {
			&:before {
				content : ''; display: block;
				width:10px; height:10px; background: #333; border-radius:50%;
				margin:2px;
			}
		}
	}
</style>




