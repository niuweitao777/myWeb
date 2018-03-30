(function(w){
	w.transformCss = function (node,name,value){
			//创建一个对象，保存名值对
			//先检测node上到底有没有aaa属性，如果没有，我就给他添加一个属性
			if(!node.aaa){
				//自定义属性
				node.aaa = {};								
			};
			
			//赋值
			//arguments 实参
			if(arguments.length > 2){
				//用来保存最终结果
				var result = '';
				//写  --- 赋值
				//把名值对放在对象中， node.aaa
				node.aaa[name] = value;
				
//				node.aaa.name = value;
//				node.aaa['name'] = value;
								
				//{translateX:200,scale:0.5}
				//遍历(枚举)对象中每一个属性 for...in
				for(var i in node.aaa){
					// i = translateX
					//i = scale
					switch (i){
						case 'translateX':
						case 'translateY':
						case 'translateZ':
						case 'translate':
							result += i + '('+ node.aaa[i] +'px) ';
							break;
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							result += i + '('+ node.aaa[i] +') ';
							break;
						case 'rotate':
						case 'skew':
						case 'skewX':
						case 'skewY':							
							result += i + '('+ node.aaa[i] +'deg) ';
							break;
					};
					
				};

				//把result结果给box的css样式填进去
				node.style.transform = result;
				//node.style.transform = 'translateX(200px);'
				
			}else{
				//读
				if(typeof node.aaa[name] == 'undefined'){
					//默认状态
					if(name == 'scale' || name == 'scaleX' || name == 'scaleY'  ){
						value = 1;
					}else{
						//translate , rotate , skew
						value = 0;
					};
					
				}else{
					//正常状态 ： 先做写的操作，在读取数值
					value = node.aaa[name];
				};
				
				return value;
				
			};
			
		};
	
})(window);

