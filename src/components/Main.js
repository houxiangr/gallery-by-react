require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';


//引入图片的数组数据
var imageDatas = require('../data/imageDatas.json');

//根据自执行函数图片的json信息获取图片的URL地址
imageDatas=(function getImageUrl(imageDataArr){
  for(var i=0,j=imageDataArr.length;i<j;i++){
    var oneImageData = imageDataArr[i];

    oneImageData.imageData = require('../images' + oneImageData.imgName);

    imageDataArr[i] = oneImageData;
  }
  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
