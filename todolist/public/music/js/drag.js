(function(w){
	
	w.wrapDrag = function (navsWrap,callback){
			//橡皮筋（越来越难拖，回弹） ， 加速 ，即点即停,防抖动
			// 元素初始位置+ 手指距离差
			//var navsWrap = document.getElementById('wrap');
			//var navList = document.getElementById('content');
			//children 父元素剔除空白文本之后的所有子元素
			var navList = navsWrap.children[0];
//			console.log(navList);
			
			transformCss(navList,'translateZ',0.1);
			
			//定义元素初始位置
			var eleY = 0;
			//定义手指初始位置
			var startY = 0;
			
			//初始时间
			var beginTime = 0;
			//初始位置
			var beginValue = 0;
			//结束时间
			var endTime = 0;
			//结束位置
			var endValue = 0;
			//时间差
			var disTime = 1;
			//距离差
			var disValue = 0;
			
			//tween 
			var Tween ={
				//正常：linear
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//回弹 : easeOut
				easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			};
		
			//定时器
			var timer = 0;
			
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
		
			navsWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//即点即停
				clearInterval(timer);
				
				//清除过渡
				navList.style.transition = 'none';
				
				//元素初始位置
				eleY = transformCss(navList,'translateY');
				//手指初始位置
				startY = touch.clientY;
				
				startX = touch.clientX;
				
				//初始时间
				beginTime = new Date().getTime(); // 毫秒
				//初始位置
				beginValue = eleY;
				
				//清除上一次遗留的disValue
				disValue = 0;
				
				if(callback && callback['start']){
					callback['start']();
				};
				
				//重置
				isY = true;
				isFirst = true;
			});
			navsWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				if(!isY){
					return
				};
				
				//手指结束位置
				var endY = touch.clientY;
				
				//手指距离差
				var disY = endY - startY;
				
				var endX = touch.clientX;
				
				var disX = endX - startX;
				
				//橡皮筋拖的过程
				var translateY = disY+eleY;
				var minY = document.documentElement.clientHeight - navList.offsetHeight;
				if(translateY > 0){
					//比例，比例减小的
					//为了保证不同机型实现的效果类似
					var scale  = 1 - translateY/document.documentElement.clientHeight;

					//translateY整体处于增加的状态，但是每次增加的幅度在减小
					//抛物线
					translateY = translateY*scale;

				}else if(translateY < minY){
					//留白区域距离,留白区域为正直
					//绝对值或者正负号调整 
					var over = minY - translateY;
					var scale  = 1 - over/document.documentElement.clientHeight;
					
					translateY = minY - over*scale;
					
				};
				
				//防抖动
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX) > Math.abs(disY)){
						isY = false;
						return;
					};
					
				};
				
				//确定元素位置
				transformCss(navList,'translateY',translateY);
				
				//结束时间
				endTime = new Date().getTime();
				//结束位置
				endValue = translateY;
				//时间差
				disTime = endTime - beginTime;
				//距离差
				disValue = endValue - beginValue;
				
				if(callback && callback['move']){
					callback['move']();
				};
			});
			
			//加速滑动
			navsWrap.addEventListener('touchend',function(){
				var speed = disValue/disTime;
								
				//目标位置 = 元素的touchmove产生的距离+速度产生的距离
				var target = transformCss(navList,'translateY')+speed*100;
				//start - move - end  ===> tartget 
				//strat - end  === > tartget 
//				console.log(target);	
					
				//橡皮筋回弹
				var minY = document.documentElement.clientHeight - navList.offsetHeight;
				
				//执行的类型
				var type = 'Linear';
				if(target > 0){
					target = 0;
					type = 'easeOut';
//					console.log(target);
				}else if(target < minY){
					target = minY;
					type = 'easeOut';
				};
				
				
				//模拟过渡，使用tween
				var time = 1;
				tweenMove(type,target,time);			
			});
			function tweenMove(type,target,time){
				//t:当前次数
				var t = 0;
				//b:初始位置
				var b = transformCss(navList,'translateY');
//				console.log(b) //-364
				//c:结束位置与初始位置距离差
				var c = target - b;
//				console.log(c) //-31
				//d:总次数
				var d = time/0.02;
				
				//原因：语句需要执行多次，需要把元素初始位置到结束位置中每一步都要不出来
				//而且需要时间
				
				//清除定时器
				//防止页面多次开启定时器，对新开启的定时器造成影响
				clearInterval(timer);
				timer = setInterval(function(){
//					console.log(11111);
					t++;
					//如果此时当前次数 超过 总次数，逻辑需要停止
					if(t > d){
						//清除定时器
						clearInterval(timer);
						if(callback && callback['end']){
							callback['end']();
						};
					}else{
						var point = Tween[type](t,b,c,d);
//						console.log(point);
						transformCss(navList,'translateY',point);
						
						if(callback && callback['move']){
							callback['move']();
						};
					};
										
				},20);
				
				
			};
			
		};
		
		
	
	
})(window);
