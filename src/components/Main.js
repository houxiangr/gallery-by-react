require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';


//引入图片的数组数据
var imageDatas = require('../data/imageDatas.json');

//根据自执行函数图片的json信息获取图片的URL地址
imageDatas=(function getImageUrl(imageDataArr){
  for(var i=0,j=imageDataArr.length;i<j;i++){
    var oneImageData = imageDataArr[i];

    oneImageData.imageURL = require('../images/' + oneImageData.imgName);

    imageDataArr[i] = oneImageData;
  }
  return imageDataArr;
})(imageDatas);

//图片组件
class ImgFigure extends React.Component {

  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }

  handleClick(e){
    if(this.props.arrange.isCenter === true) {
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};
    //如果指定了位置信息，则使用相应的位置信息
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片设置了旋转角度且不为0，设置旋转属性
    if(this.props.arrange.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach(function (value){
        styleObj[value+'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    //控制图片翻转
    let ImgFigureClassName = 'img-figure';
    ImgFigureClassName += this.props.arrange.isReverse ? ' is-reverse' : '';

    return (
      <figure className={ImgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.imgTitle} className="img-entity"/>
        <figcaption>
          <h2 className="img-title">{this.props.data.imgTitle}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.imgDetail}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: '0',
        //     top: '0'
        //   },
        //   rotate: 0,
        //   isRevrese: false,
        //   isCenter: false
        // }
      ]
    };
  }

  //各分区图片可以存在的取值范围
  Constant = {
    // 中心图片位置的取值
    centerPos: {
      left: 0,
      top: 0
    },
    // 左右两部分图片位置的取值范围
    hPosRange: {
      leftX: [0, 0],
      rightX: [0, 0],
      leftAndRightY: [0, 0]
    },
    // 上区域图片位置的取值范围
    vPosRange: {
      topX: [0, 0],
      topY: [0, 0]
    }
  };

  // 获取一定范围的随机数
  getRangeRandom(min, max){
    return Math.ceil(Math.random() * (max - min) + min);
  }

  // 获取正负15旋转角度随机数
  get15DegRandom(){
    return (Math.random > 0.5 ? '-' : '') + Math.ceil(Math.random() * 15);
  }


  // 翻转图片
  inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      var imgArrange = imgsArrangeArr[index];
      imgArrange.isReverse = !imgArrange.isReverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  }

  //边缘图片居中
  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }
  //重新布局图片
  //centerImg处于中心图片的ID
  rearrange(centerImg){
    var imgArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        leftX = Constant.hPosRange.leftX,
        rightX = Constant.hPosRange.rightX,
        leftAndRightY = Constant.hPosRange.leftAndRightY,
        topX = Constant.vPosRange.topX,
        topY = Constant.vPosRange.topY;

    //取放置中心的图片
    var imgArrangeCenterArr = imgArrangeArr.splice(centerImg, 1);
    //首先居中中心图片
    imgArrangeCenterArr[0].pos = centerPos;
    imgArrangeCenterArr[0].rotate = 0;
    imgArrangeCenterArr[0].isReverse = false;
    imgArrangeCenterArr[0].isCenter = true;

    //取位于上层区域的图片
    var topImgIndex = Math.floor(Math.random()*imgArrangeArr.length),
      imgArrangeTopArr = imgArrangeArr.splice(topImgIndex, 1);

    //布局上层的图片
    imgArrangeTopArr[0] = {
      pos:{
        top: this.getRangeRandom(topY[0], topY[1]),
        left: this.getRangeRandom(topX[0], topX[1])
      },
      rotate: this.get15DegRandom(),
      isReverse: false,
      isCenter: false
    };

    //布局左右部分区域的图片
    for(let i = 0,j = imgArrangeArr.length,k = j / 2;i<j;i++){
      //前半部分布局在左边，后半部分布局在右边
      if(i < k){
        imgArrangeArr[i].pos = {
          top: this.getRangeRandom(leftAndRightY[0], leftAndRightY[1]),
          left: this.getRangeRandom(leftX[0], leftX[1])
        };
        imgArrangeArr[i].rotate = this.get15DegRandom();
        imgArrangeArr[i].isReverse = false;
        imgArrangeArr[i].isCenter = false;
      }else{
        imgArrangeArr[i].pos = {
          top: this.getRangeRandom(leftAndRightY[0], leftAndRightY[1]),
          left: this.getRangeRandom(rightX[0], rightX[1])
        };
        imgArrangeArr[i].rotate = this.get15DegRandom();
        imgArrangeArr[i].isReverse = false;
        imgArrangeArr[i].isCenter = false;
      }
    }

    //填充之前踢出的中心位置和上层位置图片
    imgArrangeArr.splice(topImgIndex, 0, imgArrangeTopArr[0]);
    imgArrangeArr.splice(centerImg, 0, imgArrangeCenterArr[0]);

    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }


  componentDidMount(){
    //拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到图片组件的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgFigureW = imgFigureDOM.scrollWidth,
        imgFigureH = imgFigureDOM.scrollHeight,
        halfImgFigureW = Math.ceil(imgFigureW / 2),
        halfImgFigureH = Math.ceil(imgFigureH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgFigureW,
      top: halfStageH - halfImgFigureH
    };

    this.Constant.hPosRange.leftX[0] = -halfImgFigureW;
    this.Constant.hPosRange.leftX[1] = halfStageW - halfImgFigureW * 3;
    this.Constant.hPosRange.rightX[0] = halfStageW + halfImgFigureW;
    this.Constant.hPosRange.rightX[1] = stageW - halfImgFigureW;
    this.Constant.hPosRange.leftAndRightY[0] = -halfImgFigureH;
    this.Constant.hPosRange.leftAndRightY[1] = stageH - halfImgFigureH;

    this.Constant.vPosRange.topX[0] = halfStageW - imgFigureW;
    this.Constant.vPosRange.topX[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgFigureH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgFigureH * 3;

    this.rearrange(0);

  }
  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isReverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
