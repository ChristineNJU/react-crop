import React from 'react';
import { useState,useEffect } from 'react';
import Preview from './Preview';
// import kangna from './kangna.png';
import './App.css';
import { throttle } from './util';

function App() {
  const ratio = 1;
  // const imageWidth = 1152;
  // const imageHeight = 695;
  const cropWidth = 300;
  
  const moveRef = React.createRef();
  const resizeRef = React.createRef();
  const imageRef = React.createRef();  
  const uploadRef = React.createRef();  
  
  const [imageData, setImageData] = useState(null);
  const [imageWidth,setImageWidth] = useState(0);
  const [imageHeight,setImageHeight] = useState(0);


  const [cropHeight, setCropHeight] = useState(0);
  const shorter = cropWidth > cropHeight ? cropHeight : cropWidth;
  const [selectLeft, setSelectLeft] = useState(0);
  const [selectTop, setSelectTop] = useState(0);
  const [selectWidth, setSelectWidth] = useState(shorter);
  const [selectHeight, setSelectHeight] = useState(shorter*ratio);  

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mouseBegin,setMouseBegin] = useState({x:null,y:null});
  const [selectBegin,setSelectBegin] = useState({x:null,y:null,w:null,h:null});

  // useEffect(() => {
  //   console.log('isDragging:'+isDragging,'isResizing'+isResizing)
  // },[isDragging,isResizing])

  let selectStyle = {
    left:selectLeft+'px',
    top:selectTop+'px',
    width:selectWidth+'px',
    height:selectHeight+'px'
  }

  function cropMouseDown(e){
    e.persist();
    const isMoveClick = e.target === moveRef.current;
    const isResizeClick = e.target === resizeRef.current;
    if(isMoveClick || isResizeClick){
      setMouseBegin({
        x:e.clientX,
        y:e.clientY
      })
      setSelectBegin({
        x:selectLeft,
        y:selectTop,
        w:selectWidth,
        h:selectHeight
      })
    }
    if(isMoveClick){
      setIsDragging(true)
    }
    if(isResizeClick){
      setIsResizing(true)
    }
  }
  function cropMouseUp(e){
    e.persist();
    setIsDragging(false);
    setIsResizing(false);
  }
  
  // const [_movingLast, _setMovingLast] = useState(null);
  // function cropMouseMoving(e){
  //   e.persist();
  //   if(!isDragging && !isResizing) return;
  //   let _current = new Date();

  //   if(!_movingLast || _current - _movingLast > 40){
  //     _setMovingLast(_current)
  //     let currentMouse = {
  //       x:e.clientX,
  //       y:e.clientY
  //     }
  //     console.log('moving');
  //     if(isDragging) selectMove(currentMouse)
  //     if(isResizing) selectResize(currentMouse)
  //   }
  // }
  function cropMouseMoving(e){
    e.persist();
    if(!isDragging && !isResizing) return;
    let currentMouse = {
      x:e.clientX,
      y:e.clientY
    }
    if(isDragging) selectMove(currentMouse)
    if(isResizing) selectResize(currentMouse)
  }

  function selectMove(currentMouse){
    if(!isDragging) return;
    let offsetX = currentMouse.x - mouseBegin.x;
    let offsetY = currentMouse.y - mouseBegin.y;
    let newSelectLeft = selectBegin.x + offsetX;
    let newSelectTop = selectBegin.y + offsetY;
    if(!willOverflowX(newSelectLeft,selectWidth)){
      setSelectLeft(newSelectLeft);
    }
    if(!willOverflowY(newSelectTop,selectHeight)){
      setSelectTop(newSelectTop)
    }
  }
  function selectResize(currentMouse){
    if(!isResizing) return;
    let offsetX = currentMouse.x - mouseBegin.x;
    let offsetY = currentMouse.y - mouseBegin.y;
    let offset = offsetX < offsetY ? offsetX : offsetY;
    let newSelectWidth = selectBegin.w + offset;
    let newSelectHeight = selectBegin.h + offset;
    if(!willOverflow(selectLeft ,selectTop ,newSelectWidth ,newSelectHeight)){
      setSelectWidth(newSelectWidth);
      setSelectHeight(newSelectHeight);
    }else{
    }
  }
  function willOverflowX(left,width){
    if(left && left < 0) return true;
    if(left && width && left + width > cropWidth) return true;
    return false;
  }
  function willOverflowY(top,height){
    if(top && top < 0) return true;
    if(top && height && top + height > cropHeight) return true;
    return false;
  }
  function willOverflow(left,top,width,height){
    return willOverflowX(left,width) || willOverflowY(top,height);
  }

  function upload(){
    const event = new MouseEvent('click');
    uploadRef.current.dispatchEvent(event);
  }
  function fileUpload(e){
    e.persist();
    const file = e.target.files[0];
    if(window.FileReader) {
      var fr = new FileReader();
      fr.onload = function(e) {
        let img = new Image();
        img.src = e.target.result;
        setImageData(e.target.result);                  
        img.onload = function() {
          let w = this.width;
          let h = this.height;
          setImageWidth(w);
          setImageHeight(h);
          setCropHeight(cropWidth * h / w);
          setSelectWidth(cropWidth / 2);
          setSelectHeight(cropWidth * h / w / 2);
        };      
      }
      fr.readAsDataURL(file);
    }
  }

  function getCroppedImageData(){
    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");
    let originLeft = imageWidth * selectLeft / cropWidth;
    let oriignTop = imageHeight * selectTop / cropHeight;
    let canvasWidth = imageWidth * selectWidth / cropWidth;
    let canvasHeight = canvasWidth * ratio;
    c.width = canvasWidth;
    c.height = canvasHeight;
    ctx.drawImage(imageRef.current ,originLeft ,oriignTop ,canvasWidth ,canvasHeight,0, 0, canvasWidth, canvasHeight);
    return c.toDataURL('image/png');
  }
  function download(){
    const imageData = getCroppedImageData();
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = 'result';
    a.href = imageData;
    a.dispatchEvent(event);
  }
  
  
  return (
    <div className="App">
      <div className="content">
        <div className="upload">
          <div className="btns-wrapper">
            <div className="btn btn-upload" onClick={upload}>上传图片</div>
            <input type="file" ref={uploadRef} id="upload" style={{display:'none'}} onChange={fileUpload}/>
            <div className="btn btn-download" onClick={download}>下载结果</div>
          </div>
          <div className="crop" style={{width:cropWidth+'px',height:cropHeight+'px'}}>
            <img ref={imageRef} className="image-origin" src={imageData} alt="logo" />
            <div 
              className="crop-bg" 
              onMouseDown={cropMouseDown}
              onMouseUp={cropMouseUp}
              onMouseMove={throttle(cropMouseMoving,40)}
              onMouseLeave={cropMouseUp}
            >
              <div 
                ref={moveRef}
                className="crop-select" 
                style={selectStyle}
              >
                <div
                  ref={resizeRef} 
                  className="crop-resize"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="preview-warpper">
          <Preview img={imageData} sizeInfo={{selectWidth,selectHeight,selectLeft,selectTop,cropWidth,cropHeight}}></Preview>
        </div>
      </div>
    </div>
  );
}

export default App;
