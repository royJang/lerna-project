<template>
	<mask :show="show"></mask>
	<layer :show="show" size="large">
		<div class="phoenix-p-file-upload">
			<div class="phoenix-p-head">
				上传文件
				<span class="phoenix-p-close" @click="show = false;">×</span>
			</div>
			<div class="btnAdd">
				<slot></slot>
				<button class="mockBtnAdd">上传</button>
			</div>
			<div class="dragdrop" :class="{ 'dragover' : isDragover }"
				 @dragenter.prevent="dragenter"
				 @dragover.prevent="dragover"
				 @drop.prevent="drop"
				 @dragleave.prevent="dragleave">
				 <p>可将文件或文件夹直接拖放至该区域</p>
			</div>
			<div class="uploadFileList">
				<ul>
					<li v-for="v in iFiles" title="{{ $key }}">
						<span class="pf-key">{{ $key }}</span>
						<img-preview :value="v.target"></img-preview>
						<progress-bar :value="v.percent"></progress-bar>
						<span class="pf-status">{{{ v.status }}}</span>
					</li>
				</ul>	
			</div>
		</div>
	</layer>
</template>	
<script type="text/javascript">
	
	import _ from 'lodash';
	import mask from './mask.vue';
	import layer from './layer.vue';
	import progressBar from './progressBar.vue';
	import imgPreview from './imgPreview.vue';

	export default {
		name : 'perttyFileUpload',	
		props : {
			show : {
				type : Boolean,
				default : false,
				twoWay : true
			}
		},
		data (){
			return {
				iFiles : {
				},
				isDragover : false
			}
		},
		methods : {
		},
		components : [
			mask,
			layer,
			progressBar,
			imgPreview
		],
		created (){

		    this.$on('onBeforeFileUpload', ( file ) => {});
		    
		    this.$on('onFileUpload', ( file ) => {
		    	this.updateFileStatus( file, {
	    			status : '<span class="success" title="上传成功">√</span>'
	    		});
		    });

		    this.$on('onAfterFileUpload', ( file ) => {
		    });

		    this.$on('onFileChange', ( files ) => {
		    	this.fileChange( files );
		    });	

		    this.$on('onFileProgress', ( file, percent ) => {
	    		this.updateFileStatus( file, {
	    			percent : percent.percent
	    		});
		    });

		    //格式验证失败
		    this.$on('onAfterFormat', ( files, format ) => {
		    	files.forEach(( f ) => {
		    		this.updateFileStatus( f, {
		    			status : `<span class="error" 
		    				title="仅支持 ${format.split("|").join(", ")} 格式的文件">×</span>`
		    		});
		    	});
		    });

		    //验证文件大小失败
		    this.$on('onAfterCompareSize', ( files, maxsize ) => {
		    	files.forEach(( f ) => {
		    		console.log(f);
		    		this.updateFileStatus( f, {
		    			status : `<span class="error" 
		    				title="文件大小不能超过${maxsize}M">×</span>`
		    		});
		    	});
		    });

		    this.$on('onFileError', ( file, err ) => {
		    });

		    function preventDefault ( e ){
		    	e.preventDefault(); 
		    }

		    document.body.addEventListener('dragleave', preventDefault);
		    document.body.addEventListener('drop', preventDefault);
		    document.body.addEventListener('dragenter', preventDefault);
		    document.body.addEventListener('dragover', preventDefault);
		},
		methods : {
			updateFileStatus ( file, options ){
				this.iFiles[ file.name ] = _.assign( {}, this.iFiles[ file.name ], options )
			},
			dragenter ( e ){
			},
			drop ( e ){
				this.isDragover = false;
				this.$broadcast('updateFiles', e.dataTransfer.files);
			},
			dragover ( e ){
				this.isDragover = true;
			},
			dragleave ( e ){
				this.isDragover = false;
			},
			fileChange ( files ){
				//遍历上传文件，添加进度
		    	Array.prototype.slice.call( files, 0 ).forEach(( file ) => {
		    		//已存在于上传列表
					if( this.iFiles[ file.name ] ) return;
					let newF = {};		    		
					newF[ file.name ] = {
						target: file
					};						
			    	//只做添加操作	
			    	this.iFiles = Object.assign( {}, this.iFiles, newF );
		    	});	
			}
		}
	}

</script>
<style lang="less">
	.phoenix-file-upload-custom-wrap {
	}
	.phoenix-file-upload-custom-field {
		width:100px; height:40px; background:transparent; border-radius: 3px; outline: none;
		&:hover ~ .mockBtnAdd {
			background: #eee !important;
		}	
	}
	.phoenix-p-file-upload {
		border-radius: 3px;
		.phoenix-p-head {
			background: #eee; text-align: left;padding:12px; 
			border-bottom:1px solid #ccc; font-size: 14px; 
			border-top-left-radius: 3px; clear:both;
			border-top-right-radius: 3px;
			.phoenix-p-close {
				float: right; cursor: pointer;
			}
		}
		.btnAdd {
			padding:10px; border-bottom: 1px solid #ccc; position: relative;
			text-align: left;
			.mockBtnAdd {		
				width:100px; height:40px; border:1px solid #ccc; color:#09c; 
				border-radius: 3px; font-size: 14px; outline: none;
				position: absolute; left:10px; top:10px;
				pointer-events: none; background: #fff;
			}
		}
		.dragdrop {
			width:100%; font-size: 14px; text-align: center; 
			color:#aaa; padding:15px; box-shadow: border-box;
			>p { padding:25px; box-sizing: border-box; border:1px dashed #fff; }

			&.dragover {
				color:#333; 	
				& > p {
					border-color: #ccc;
				}
			}
		}
		.uploadFileList {
			border-top:1px solid #ccc; text-align: left; padding:10px; max-height: 300px;
			overflow-y:auto;
			li {
				padding:5px; font-size: 12px;
			}
			.pf-key {	
				vertical-align: 2px; margin-right: 5px; white-space: nowrap; 
				text-overflow: ellipsis; width:120px; display: inline-block;
				overflow: hidden;
			}
			.pf-status {
				vertical-align: 6px;
    			margin-left: 5px;
    			display: inline-block;
    			cursor: help;
    			
    			.error { color:red; }
    			.success { color:green; }
			}
		}
	}
	
</style>












