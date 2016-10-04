<template>
	<div class="phoenix-carousel" :style="{ width: width + 'px' }" >
		<div class="view" :style="{ height: height + 'px' }" >
	 		<div class="item" 
	 			 v-for="v in value" 
	 			 :class="{ active: $index === current }" >
				<img :src="v" alt="" >
			</div>
		</div>
		<div class="nav" :style="{ height: navHeight + 'px' }">
			<button class="ctrl prev" 
				@click="prev" 
				:disabled="navDisabled"
				:class="{ disabled: navDisabled }" >
			</button>
			<div class="window">
				<div class="list" 
					:style="{ width: listWidth + 'px', left: listLeft + 'px' }"
					:class="{ static: navDisabled, animating: navAnimating }" >
					<img v-if="navDisabled" 
						 :src="v" 
						 v-for="v in value" 
						 :style="{ width: imgWidth + 'px' }"
						 @click="select($index)" >
					<img v-if="!navDisabled"
						 :src="v.src" 
						 v-for="v in imgs" track-by="$index" 
						 :style="{ width: imgWidth + 'px' }" 
						 @click="select(v.view, v.left)" >
				</div>
			</div>
			<button class="ctrl next" 
				@click="next" 
				:disabled="navDisabled"
				:class="{ 'disabled': navDisabled }" >
			</button>
		</div>
		<!-- <button @click="change">change</button> -->
	</div>
</template>
<style lang="less">
	.phoenix-carousel {
		margin: auto;
		.view {
			position: relative; opacity: 1; width: 100%;
			border: 1px solid #ccc; box-sizing: border-box;
			.item {
				position: absolute; top: 0; left: 0;
				height: 100%; width: 100%; z-index: 998;
				opacity: 0; transition: opacity 500ms ease;
				img { height: 100%; width: 100%; }

				&.active { opacity: 1; z-index: 998 }
			}
		}
		.nav {
			position: relative; width: 100%; margin-top: 10px;
			.ctrl {
				position: absolute; top: 0; bottom: 0; margin: auto;
				height: 20px; width: 20px;
				border: 1px solid #fff; opacity: 0.75;
				border-radius: 50%;
				outline: none; user-select: none; cursor: pointer;

				&.disabled { cursor: not-allowed }
				&.disabled:hover { opacity: 0.75 }

				&:hover { opacity: 1 }
				&:before {
					content: '';
					display: block; 
					height: 5px; width: 5px;
					border: 2px solid #666;
					border-top: none;
				}
			}
			.prev {
				left: 0; margin-right: 5px;
				&:before { 
					border-right: none;		
					margin-left: 1px;			
					transform: rotateZ(45deg); 
				}
			}
			.next {
				right: 0; margin-left: 5px;
				&:before { 
					border-left: none;
					margin-left: -1px;
					transform: rotateZ(-45deg); 
				}
			}
			.window {
				position: absolute; 
				top: 0; right: 25px; bottom: 0; left: 25px;
				height: 100%; overflow: hidden;
				border: 1px solid #ccc; box-sizing: border-box;
			}
			.list {
				position: absolute; height: 100%;
				&.static { left: 0; right: 0; margin: auto; }
				&.animating { transition: left 500ms ease; }

				img {
					flex: 1; height: 100%; margin: 0 5px;
					cursor: pointer;
					border-right: 1px solid #ccc; border-left: 1px solid #ccc;
					box-sizing: border-box;
					&:hover { 
						box-shadow: 0 0 10px #ccc;
						// transform: scale(1.2);
					}
				}
			}
		}
	}
	
</style>
<script>
	export default {
		name: 'carousel',
		props: {
			width: {
				type: Number,
				default: 200
			},
			height: {
				type: Number,
				default: 200
			},
			// 窗口中展示的图片数量
			piece: {
				type:Number,
				default: 4
			},
			value: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				imgs: [],
				current: 0,

				listLeft: 0,
				listLeftMax: 0,
				listLeftMin: 0,
				listLeftMap: {},

				listLeftBegin: 0,
				listLeftEnd: 0,

				eachWidth: 0,
				imgWidth: 0,
				navHeight: 0,
				listWidth: 0,

				navDisabled: false,
				navAnimating: true
			}
		},
		ready() {
			// left & right ctrl width = 50
			this.eachWidth = ( this.width - 50 ) / this.piece;
			// img margin = 10
			this.imgWidth = this.eachWidth - 10;
			this.navHeight = this.imgWidth * this.height / this.width;

			// img数量小于piece, 不滑动
			if ( this.value.length < this.piece ) {
				this.navDisabled = true ;
				this.listWidth = this.eachWidth * this.value.length;
			} else {
				let imgs = [], 
					// 窗体中显示img数量奇偶不定
					p = ~~ ( this.piece / 2 ), 
					// 小于 ( this.piece / 2 ), offset 从下一个起点开始
					// 偏移 = img长度 - 窗体 / 2 + 0.5
					offset1 = this.value.length - this.piece / 2 + 0.5,
					// 大于 ( this.piece / 2 ), offset 从当前开始
					// 偏移 = 窗体 / 2
					offset2 = this.piece / 2;
					// 遍历一遍, 设定所有img在处于正前面(0.5的缘故)时，外围框的left值

				// constructe img list as:
				// [ begin-cache, some-gt-half-of-piece-length, some-lt-half-piece-length, end-cache ]
				// [ 5, 0-1-2-3-4-5, 0-1-2-3-4 ]

				this.listLeftMin = Infinity;
				this.listLeftMax = -Infinity;

				for ( let i = 0, l = this.value.length; i < l; i++ ) {
					let v = { src: this.value[ i ], view: i };

					if ( i < p ) {
						v.left = ( offset1 + i ) * -this.eachWidth;
					} else {
						// 当前位置 - 窗体 / 2 
						v.left = ( i - offset2 + 0.5 ) * -this.eachWidth;
					}

					imgs.push( v );

					// because of begin cached img
					v.left -= this.eachWidth;

					if ( v.left < this.listLeftMin ) this.listLeftMin = v.left;
					if ( v.left > this.listLeftMax ) this.listLeftMax = v.left;

					// constructe left map as:
					// [ 1, 2,3,4,5,0,1, 2 ]
					// fixed for float compution
					this.listLeftMap[ v.left.toFixed( 0 ) ] = i;
				}

				this.imgs = imgs.slice();

				// add cached img at begin
				this.imgs.unshift( imgs[ imgs.length - 1 ] );
				this.listLeftMax += this.eachWidth;
				this.listLeftMap[ this.listLeftMax.toFixed( 0 ) ] = p - 1;
				// 末尾添加 ( this.piece / 2 ) 个 img, 使得这个img左边也有img
				for ( let i = 0; i < p; i++ ) {
					this.imgs.push( imgs[ i ] );
				}
				// add cached img at end
				for ( let i = 0, vl = imgs.length, pl = p + 1; i < pl; i++ ) {
					this.imgs.push( imgs[ ( i + p ) % vl ] );
				}
				this.listLeftMin -= this.eachWidth;
				this.listLeftMap[ this.listLeftMin.toFixed( 0 ) ] = p;

				// because of begin cached img
				this.listLeft = this.imgs[ 1 ].left;
				this.listWidth = this.eachWidth * this.imgs.length;

				// when list left = cache 
				this.listLeftBegin = this.imgs[ p + 1 ].left;
				this.listLeftEnd = this.imgs[ p ].left;
			}

		},
		methods: {
			select() {
				if ( arguments.length === 1 ) {
					this.current = index;
				} else if ( arguments.length === 2 ) {
					this.navAnimating = false;
					this.current = arguments[ 0 ];
					this.listLeft = arguments[ 1 ];

					// if ( this.listLeft >= this.listLeftMax ) {
					// 	this.navAnimating = false;
					// 	this.listLeft = this.listLeftEnd;
					// 	setTimeout(() => {
					// 		this.navAnimating = true;
					// 		this.current = arguments[ 0 ];
					// 		this.listLeft = arguments[ 1 ];
					// 	}, 150);

					// } else if ( this.listLeft <= this.listLeftMin ) {
					// 	this.navAnimating = false;
					// 	this.listLeft = this.listLeftBegin;
					// 	setTimeout(() => {
					// 		this.navAnimating = true;
					// 		this.current = arguments[ 0 ];
					// 		this.listLeft = arguments[ 1 ];
					// 	}, 150);
					// } else {
					// 	this.navAnimating = true;
					// 	this.current = arguments[ 0 ];
					// 	this.listLeft = arguments[ 1 ];

					// }
				}
			},
			prev() {
				if ( this.listLeft >= this.listLeftMax ) {
					this.navAnimating = false;
					this.listLeft = this.listLeftEnd;
					setTimeout(() => {
						this.navAnimating = true;
						this.listLeft += this.eachWidth;
						this.current = this.listLeftMap[ this.listLeft.toFixed( 0 ) ];
					}, 150);
				} else {
					this.navAnimating = true;
					this.listLeft += this.eachWidth;
					this.current = this.listLeftMap[ this.listLeft.toFixed( 0 ) ];
				}

			},
			next() {
				if ( this.listLeft <= this.listLeftMin ) {
					this.navAnimating = false;
					this.listLeft = this.listLeftBegin;
					setTimeout(() => {
						this.navAnimating = true;
						this.listLeft -= this.eachWidth;
						this.current = this.listLeftMap[ this.listLeft.toFixed( 0 ) ];;
					}, 150);

				} else {
					this.navAnimating = true;
					this.listLeft -= this.eachWidth;
					this.current = this.listLeftMap[ this.listLeft.toFixed( 0 ) ];;
				}
			}
		}

	}
</script>