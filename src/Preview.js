import React from 'react';
import { useState,useEffect } from 'react';
import previewBg from './preview-bg.jpg';
import './Preview.css';

function Preview(props) {
   const previewWidth = 100;
   const previewHeight = 100;
   const {selectWidth,selectHeight,selectLeft,selectTop,cropWidth,cropHeight} = props.sizeInfo;

   let imageW = previewWidth * cropWidth / selectWidth;
   let imageH = previewHeight * cropHeight / selectHeight;
   let imageL = imageW * selectLeft / cropWidth;
   let imageT = imageH * selectTop /cropHeight;

   let imageStyle = {
      width:  `${imageW}px`,
      height: `${imageH}px`,
      left: `-${imageL}px`,
      top: `-${imageT}px`
   }

   function getCroppedImageData(){
      let c = document.getElementById("myCanvas");
      let ctx = c.getContext("2d");
      let img = document.getElementById("scream");
      ctx.drawImage(props.img,20,100,200,200,0, 0, 200, 200);
   }

   function download(){

   }

   return (
      <div className="preview">
         
         <img className="preview-bg" src={previewBg}/>
         <div className="preview-area">
            <img className="preview-target" src={props.img} style={imageStyle}/>
         </div>
      </div>
   )
}

export default Preview;