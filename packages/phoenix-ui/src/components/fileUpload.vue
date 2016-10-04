<template>
	<div class="phoenix-file-upload phoenix-file-upload-custom-wrap" :class="customClass">
		<input type="file" class="phoenix-file-upload-custom-field" 
			   name="{{ name }}" 
			   id="{{ name }}" 
			   accept="{{ accept }}"
			   v-on:change="fileInputChange" 
			   multiple="{{ multiple }}" />
	    <slot></slot>
	</div>
</template>
<script type="text/javascript">

	import _ from 'lodash/util';

	export default {	
		name : 'fileUpload',
		props: {
		    name: {
		      type: String,
		      default (){
		          return _.uniqueId('file_upload_');
		      }
		    },
		    action: {
		      type : String,
		      required : true
		    },
		    multiple: String,
		    headers: Object,
		    method : {
		    	type : String,
		    	default : "POST"
		    },
		    format : {
		    	type : String,
		    	dafault : ''
		    },
		    maxsize : {
		    	type : Number,
		    	default : NaN
		    }
		},
		data () {
            return {
           	    iFiles: [], //保存文件列表
                formatReg : null	
            }
	    },
	    ready (){
	    	//提供外部更新files的通道
	    	this.$on('updateFiles', ( value ) => {
	    		document.getElementById( this.name ).files = value;
	    		this.fileInputChange();
	    	});
	    	this.formatReg = new RegExp(`^.+\.(${ this.format })$`, "i");
	    },
		methods: {
		    fileInputChange () {
		      //当文件改动触发的回调
		      this.iFiles = document.getElementById( this.name ).files;
		      this.$dispatch('onFileChange', this.iFiles);	
		      this.fileUpload();
		    },
		    _onProgress ( file, e ) {
		      //增加一个percent字段为当前上传百分比
		      e.percent = ( e.loaded / e.total ) * 100;
		      //触发onProgress的文件
		      this.$dispatch( 'onFileProgress', file, e );
		    },
		    _handleUpload ( file ) {
			    
			    this.$dispatch( 'onBeforeFileUpload', file );

			    let form = new FormData();
			    let xhr = new XMLHttpRequest();

			    try {
			        form.append('Content-Type', file.type || 'application/octet-stream');
			        //上传文件的key设为file
			        form.append('file', file);
			    } catch ( err ) {

			        return this.$dispatch( 'onFileError', file, err );
			    }

		        return new Promise(( resolve, reject ) => {

			        xhr.upload.addEventListener('progress', ( e ) => {
			        	this._onProgress( file, e );
			        }, false);

			        xhr.onreadystatechange = () => {

				        if ( xhr.readyState < 4 ) return;

				        if ( xhr.status < 400 ) {
				            let res = JSON.parse( xhr.responseText );
				            this.$dispatch( 'onFileUpload', file, res );
				            resolve( file );
				        } 
				        else {
				            let err = JSON.parse( xhr.responseText );
				            err.status = xhr.status;
				            err.statusText = xhr.statusText;
				            this.$dispatch( 'onFileError', file, err );
				            reject(err);
				        }
			      	}

			        xhr.onerror = () => {
			            let err = JSON.parse( xhr.responseText );
			            err.status = xhr.status;
			            err.statusText = xhr.statusText;
			            this.$dispatch( 'onFileError', file, err );
			            reject( err );
			        }

			        xhr.open( this.method, this.action, true );

			        //写入头部
			        if ( this.headers ) {
			          for( let header in this.headers ) {
			            xhr.setRequestHeader( header, this.headers[ header ] );
			          }
			        }	

			        xhr.send( form );

			        //触发上传之后的回调
			        this.$dispatch( 'onAfterFileUpload', file );
			    });
		    },
		    fileUpload () {

			    if( this.iFiles.length > 0 ) {

			    	let formatErrors = [],
			    		limitErrors = [];

			        let arrayOfPromises = Array.prototype.slice.call( this.iFiles, 0 ).map(( file ) => {

			        	if( !this.format || this.formatReg.test( file.name )){
			        		if( isNaN( this.maxsize ) || file.size < this.maxsize * 1e6 ){
				          		return this._handleUpload( file );
			        		} 
			        		else {
			        			limitErrors.push( file );
			        		}
			        	}
			        	//验证失败, 不符合格式 
			        	else {
			        		formatErrors.push( file );
			        		return;
			        	}
			        });

			        //验证格式完毕
			        if( formatErrors && formatErrors.length > 0 ){ 
			        	this.$dispatch( 'onAfterFormat', formatErrors, this.format );
			        }
			        if( limitErrors && limitErrors.length > 0 ){
			        	this.$dispatch( 'onAfterCompareSize', limitErrors, this.maxsize );
			        }

			        //等待所有文件上传完毕
			        Promise.all( arrayOfPromises ).then(( allFiles ) => {
			          	this.$dispatch( 'onAllFilesUploaded', allFiles );
			        }).catch(( err ) => {
			          	this.$dispatch( 'onFileError', this.iFiles, err );
			        });

			    } else {	
			        let err = new Error({
			        	"code" : 1,
			        	"message" : "No files to upload for this field"
			        });
			        this.$dispatch( 'onFileError', this.iFiles, err );
			    }
		    }
		}
	}
</script>
<style lang="less" scoped>
	.il {
		display: inline-block;
	}
</style>