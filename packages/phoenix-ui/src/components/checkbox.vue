<template>
	<label class="phoenix-checkbox">
		<input type="checkbox" 
			   name="{{ group }}" 
			   checked="{{ checked }}"
			   class="phoenix-checkbox-origin"	
			   value="{{ value }}"
			   v-model="active"
			   @change.prevent="updateValue( this.value )"
			   />

		<div class="checkbox-group">
			<div class="checkbox-btn">
			</div>
			<div class="checkbox-content">
				<slot></slot>
			</div>
		</div>
	</label>	
</template>	
<script>
	export default {
		name : 'checkbox',	
		props : {	
			group : {
				type : String
			},
			checked : {
				type : [ Boolean, String ]
			},
			value : {
				type : String	
			},
			active : {
				type : [String, Boolean]
			}
		},
		created (){
			//group都由父级定义
			if( this.$parent && this.$parent.group ) {	
				this.group = this.$parent.group;	
			} else {
				throw new Error('<checkbox>的父级必须是一个<btn-group>');
			}

			//将属性checked为true的结果设为当前group的 value
			if( this.checked ){
				this.updateValue( this.value );
			}
		},
		methods : {
			updateValue ( value ){
				this.$dispatch('updateValue', {
					type : 'checkbox',
					value : value,
					push : this.active
				});
			}
		}
	}	
</script>
<style lang="less" scoped>

	.phoenix-checkbox {
		display: inline-block;
	}
	.checkbox-group {
		display: flex;
	}
	.checkbox-btn {
		cursor: pointer;
		width: 16px;
		height: 16px;
		line-height: 16px;
		background: #eee;
		border:1px solid #ddd;
		align-self:center;
	}
	.checkbox-content {
		vertical-align: middle; text-indent: 5px;
	}
	.phoenix-checkbox-origin {
		display: none; text-align: center; 
		&:checked ~ .checkbox-group > .checkbox-btn {
			&:before {
				content: '';
				width: 9px;
				height: 5px;
				background: transparent;
				border: 3px solid #333;
				border-top: none;
				border-right: none;
				display: block;
				margin: auto;
				margin-top:5px;
				transform: rotate(-45deg);
			}
		}
	}
</style>




